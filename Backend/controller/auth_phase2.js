import express from "express";
const authRoute2 = express.Router();

import cookieParser from "cookie-parser";
import addUser from "./user.js";

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

authRoute2.post("/create", async (req, res) => {
  try {
    const { username, email, password, age } = req.body;

    // Call the MySQL insert function
    const userId = await addUser(username, email, password, age);
    res.status(201).json({ message: "user created", userId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

export default authRoute2;
