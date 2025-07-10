import express from "express"
const authRoute2 = express();

import cookieParser from "cookie-parser";

// In ES modules (when using `type: "module"` in package.json), 
// `__filename` and `__dirname` are NOT available by default like they are in CommonJS.
// So, we need to manually construct them using the following:

import { fileURLToPath } from 'url';
import path from 'path';

// Convert the module's URL (import.meta.url) into a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module file (same as __dirname in CommonJS)
const __dirname = path.dirname(__filename);

// 👉 Purpose:
// This setup allows us to use `__dirname` to resolve paths, such as when serving static files,
// using `path.join(__dirname, 'public')`, or referencing templates and other resources


authRoute2.set("view engine", "ejs");
authRoute2.use(express.json());
authRoute2.use(express.urlencoded({ extended: true }));
authRoute2.use(express.static(path.join(__dirname, 'public')));
authRoute2.use(cookieParser());

export default authRoute2;