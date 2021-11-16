const mysql = require("mysql");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { validateToken } = require("./middleware/AccMiddleware");
const { sign } = require("jsonwebtoken");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

//Application programming interface (API)

//Account
// Sign up an account (1)
app.post("/account", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    db.query("call sign_up(?,?);", [username, password], (err) => {
      if (err) {
        console.log(err);
      } else {
        const accessToken = sign(
          { username: username, id: result[0][0].id },
          "Please Don't Break My First Website"
        );
        res.json({ token: accessToken, username: username, id: user.id });
        res.json("SUCCESSFUL");
      }
    });
    console.log("1");
  });
});

// Validate account
app.get("/account/auth", validateToken, (req, res) => {
  res.json(req.user);
  console.log("Successful");
});

app.listen(9998, () => {
  console.log("Server running on port 9998");
});
