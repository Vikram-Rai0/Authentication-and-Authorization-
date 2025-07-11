import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const authRoute2 = express.Router();

import cookieParser from "cookie-parser";
import userModel from "./user.js";
import db from "../module/db.js";

// In ES modules (when using `type: "module"` in package.json),
// `__filename` and `__dirname` are NOT available by default like they are in CommonJS.
// So, we need to manually construct them using the following:

import { fileURLToPath } from "url";
import path from "path";

// Convert the module's URL (import.meta.url) into a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module file (same as __dirname in CommonJS)
const __dirname = path.dirname(__filename);

// 👉 Purpose:
// This setup allows us to use `__dirname` to resolve paths, such as when serving static files,
// using `path.join(__dirname, 'public')`, or referencing templates and other resources

authRoute2.use(express.json());
authRoute2.use(express.static(path.join(__dirname, "public")));
authRoute2.use(cookieParser());

authRoute2.post("/signup", (req, res) => {
  try {
    const { username, email, password, age } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      // console.log(salt);
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.json(err.message);
        console.log(hash);

        try {
          const userId = await userModel(username, email, hash, age);
          // Call the MySQL insert function

          const token = jwt.sign({ email }, "asdflkj");

          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
          });

          // ✅ Single final response
          res.status(201).json({ message: "user Created", userId });
        } catch (dbError) {
          res.status(500).json({ error: dbError.message });
        }
      });
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

//login
authRoute2.get("/login", function (req, res) {
  res.render("login");
});

// login
authRoute2.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal server error");
    }

    if (result.length === 0) {
      return res.status(401).send("Email not found");
    }

    const user = result[0]; // User fetched from DB

    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err) {
        console.error("Bcrypt error:", err);
        return res.status(500).send("Error comparing Password");
      }

      if (isMatch) {
        const token = jwt.sign({ email: user.email }, "abcde", {
          expiresIn: "1h",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // true in production
          sameSite: "strict",
        });

        res.send("✅ Login successful");
      } else {
        res.status(401).send("❌ Incorrect password");
      }
    });
  });
});

//logout
authRoute2.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
});

export default authRoute2;
