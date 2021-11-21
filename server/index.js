const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("./middleware/AccMiddleware");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "VNForum",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Vacebook application programming interface (API)

//Account
// Sign up an vacebook account (1)
app.post("/account", (req, res) => {
  const data = req.body;
  bcrypt.hash(data.password, 10).then((hash) => {
    db.query("call sign_up(?,?);", [data.username, hash], (err, result) => {
      if (!result[0][0].id) {
        res.json({ error: "Wrong Username Or Password Combination" });
      } else {
        const Token = sign(
          { username: data.username, id: result[0][0].id },
          "Please Don't Break My First Website"
        );
        res.json({
          token: Token,
          username: data.username,
          id: result[0][0].id,
        });
      }
    });
  });
});

// Validate vacebook account
app.get("/account/auth", validateToken, (req, res) => {
  res.json(req.user);
});

//Sign in an vacebook account (2)
app.post("/signin", (req, res) => {
  const data = req.body;
  db.query("call sign_in(?);", data.username, (err, result) => {
    if (!result[0][0].id) {
      res.json({ error: "Wrong Username Or Password Combination" });
    } else {
      bcrypt.compare(data.password, result[0][0].pass).then((match) => {
        if (!match) {
          res.json({ error: "Wrong Username Or Password Combination" });
        } else {
          const Token = sign(
            { username: data.username, id: result[0][0].id },
            "Please Don't Break My First Website"
          );
          res.json({
            token: Token,
            username: data.username,
            id: result[0][0].id,
          });
        }
      });
    }
  });
});

//Create a vacebook post
app.post("/post/create", validateToken, (req, res) => {
  const post = req.body;
  post.id = req.user.id;
  db.query(
    "call add_post(?,?,?);",
    [post.title, post.Text, post.id],
    (err, result) => {
      if (!result[0][0].id) {
        res.json({ error: "Invalid Vacebook Account!" });
      } else {
        res.json("Successful!");
      }
    }
  );
});

app.listen(9998, () => {
  console.log("Server running on port 9998");
});
