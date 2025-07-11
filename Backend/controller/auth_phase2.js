// Import required modules
import express from "express";
import bcrypt from "bcrypt"; // For password hashing
import jwt from "jsonwebtoken"; // For token generation and verification
const authRoute2 = express.Router(); // Creating an Express Router

import cookieParser from "cookie-parser"; // Middleware to parse cookies
import userModel from "./user.js"; // A function/module that inserts new users into the DB
import db from "../module/db.js"; // MySQL connection instance

// Handling __dirname and __filename in ES Modules (type: "module" in package.json)
import { fileURLToPath } from "url";
import path from "path";

// Convert import.meta.url to __filename
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current file
const __dirname = path.dirname(__filename);

// Middleware to handle JSON, static files and cookies
authRoute2.use(express.json());
authRoute2.use(express.static(path.join(__dirname, "public"))); // Serve static files from /public
authRoute2.use(cookieParser());

// --------------------------- SIGNUP ROUTE --------------------------- //
authRoute2.post("/signup", (req, res) => {
  try {
    const { username, email, password, age } = req.body; // Destructure input

    // Generate a salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.json(err.message);

        try {
          // Save the user to the database using userModel (assumed insert function)
          const userId = await userModel(username, email, hash, age);

          // Generate a JWT token with email payload
          const token = jwt.sign({ email }, "asdflkj");

          // Set the token as an HTTP-only cookie
          res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: "strict", // Prevent CSRF
          });

          // Send success response
          res.status(201).json({ message: "user Created", userId });
        } catch (dbError) {
          res.status(500).json({ error: dbError.message }); // Handle DB error
        }
      });
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

// --------------------------- LOGIN PAGE (Render) --------------------------- //
authRoute2.get("/login", function (req, res) {
  res.render("login"); // Render login.ejs or equivalent view
});

// --------------------------- LOGIN ROUTE (POST) --------------------------- //
authRoute2.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Check if user exists in database
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal server error");
    }

    if (result.length === 0) {
      return res.status(401).send("Email not found"); // No user with email
    }

    const user = result[0]; // Get user details

    // Compare hashed password
    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err) {
        console.error("Bcrypt error:", err);
        return res.status(500).send("Error comparing Password");
      }

      if (isMatch) {
        // Generate JWT token on successful login
        const token = jwt.sign({ email: user.email }, "abcde", {
          expiresIn: "1h", // Token valid for 1 hour
        });

        // Send token as HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // Set to true in production
          sameSite: "strict",
        });

        res.send("✅ Login successful");
      } else {
        res.status(401).send("❌ Incorrect password"); // Wrong password
      }
    });
  });
});

// --------------------------- LOGOUT ROUTE --------------------------- //
authRoute2.get("/logout", function (req, res) {
  res.cookie("token", ""); // Clear the token
  res.redirect("/"); // Redirect to home page
});

export default authRoute2; // Export the router for use in main app
