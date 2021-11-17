const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { validateToken } = require("./middleware/AccMiddleware");
const { sign } = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "VNForum",
});

//Application programming interface (API)

//Account
// Sign up an account (1)
app.post("/account", (req, res) => {
  const data = req.body;
  bcrypt.hash(data.password, 10).then((hash) => {
    db.query("call sign_up(?,?);", [data.username, hash], (err, result) => {
      if (err) {
        res.json(err);
      } else {
        const accessToken = sign(
          { username: data.username, id: result[0][0].id },
          "Please Don't Break My First Website"
        );
        res.json({
          token: accessToken,
          username: data.username,
          id: result[0][0].id,
        });
      }
    });
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
