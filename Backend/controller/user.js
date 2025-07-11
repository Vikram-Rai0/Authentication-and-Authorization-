import db from "../module/db.js";

const userModel = (username, email, password, age) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO users (username, email, password, age) VALUES (?, ?, ?, ?)";
    db.query(query, [username, email, password, age], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

export default userModel;
