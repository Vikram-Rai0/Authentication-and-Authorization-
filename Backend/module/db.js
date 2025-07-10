import dotenv from "dotenv";
import mysql from "mysql2";


// Load env vars
dotenv.config();



// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) console.error("❌ DB connection failed:", err.message);
    else console.log("✅ DB connected successfully!");
});

export default db;