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

// Vacebook application programming interface (API)

// Sign up an vacebook account (1) (Vy)
app.post("/account", (req, res) => {
  const data = req.body;
  bcrypt.hash(data.password, 10).then((hash) => {
    db.query("call sign_up(?,?);", [data.username, hash], (err, result) => {
      if (!result[0][0].id) {
        res.json({ error: "Username exists!" });
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

// Validate vacebook account (2) (Vy)
app.get("/account/auth", validateToken, (req, res) => {
  User = req.user;
  db.query(
    "select validate_user(?,?) as id;",
    [User.id, User.username],
    (err, result) => {
      if (!result[0].id) {
        res.json({ error: "Invalid Vacebook Account!" });
      } else {
        res.json(req.user);
      }
    }
  );
});

// Sign in an vacebook account (3) (Vy)
app.post("/signin", (req, res) => {
  const data = req.body;
  db.query("call sign_in(?);", data.username, (err, result) => {
    if (!result[0][0].id) {
      res.json({ error: "Wrong Username Or Password" });
    } else {
      bcrypt.compare(data.password, result[0][0].pass).then((match) => {
        if (!match) {
          res.json({ error: "Wrong Username Or Password" });
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

// Create a vacebook post (4) (Vy)
app.post("/post/create", validateToken, (req, res) => {
  const post = req.body;
  UserId = req.user.id;
  db.query(
    "call add_post(?,?,?);",
    [post.title, post.Text, UserId],
    (err, result) => {
      if (!result[0][0].id) {
        res.json({ error: "Invalid Vacebook Account!" });
      } else {
        res.json(result[0][0].id);
      }
    }
  );
});

// Show all vacebook posts (5) (Dong)
app.get("/posts/list", validateToken, (req, res) => {
  UserId = req.user.id;
  db.query("call listPost(?);", UserId, (err, result) => {
    res.json(result[0]);
  });
});

// Show a vacebook post of a post id (6) (Vy)
app.get("/posts/byId/:id", validateToken, (req, res) => {
  const PostId = req.params.id;
  UserId = req.user.id;
  db.query("call getPostByID(?,?);", [UserId, PostId], (err, result) => {
    res.json(result[0]);
  });
});

// Show all comments of a post (7) (Vy)
app.get("/comments/:id", (req, res) => {
  const PostId = req.params.id;
  db.query("call list_cmt_of(?);", PostId, (err, result) => {
    res.json(result[0]);
  });
});

// Add a comment (8) (Dong)
app.post("/comment/create", validateToken, (req, res) => {
  comment = req.body;
  UserId = req.user.id;
  db.query(
    "call add_cmt(?,?,?);",
    [comment.cmtText, comment.PostId, UserId],
    (err, result) => {
      res.json(result[0][0].cmtId);
    }
  );
});

// Reaction a post (9) (Dong)
app.post("/like", validateToken, (req, res) => {
  const PostId = req.body.PostId;
  UserId = req.user.id;
  db.query("select act_like(?,?) as act;", [PostId, UserId], (err, result) => {
    res.json(result[0].act);
  });
});

// Delete a comment (10) (Vy)
app.delete("/comment/:id", validateToken, (req, res) => {
  const cmtId = req.params.id;
  db.query("call delete_cmt(?);", cmtId);
  res.json("Delete comment successful!");
});

// Delete a post (11) (Dong)
app.delete("/post/delete/:id", validateToken, (req, res) => {
  const PostId = req.params.id;
  UserId = req.user.id;
  db.query("call delete_post(?,?);", [PostId, UserId], (err, result) => {
    if (!result[0][0].id) {
      res.json({ error: "Invalid Vacebook Account!" });
    } else {
      res.json("Delete Successful!");
    }
  });
});

// Get basic user information (12) (Dong)
app.get("/user/info/:id", validateToken, (req, res) => {
  const thisUserId = req.params.id;
  db.query(
    "select get_username_of(?) as username;",
    thisUserId,
    (err, result) => {
      res.json(result[0].username);
    }
  );
});

// Get all post of a user (13) (Dong)
app.get("/posts/byuserId/:id", validateToken, (req, res) => {
  const thisUserId = req.params.id;
  UserId = req.user.id;
  db.query(
    "call getPostByUserID(?,?);",
    [UserId, thisUserId],
    (err, result) => {
      res.json(result[0]);
    }
  );
});

// Change the password (14) (Vy)
app.put("/user/changepassword", validateToken, (req, res) => {
  User = req.user;
  const user = req.body;
  db.query("call sign_in(?);", User.username, (err, result) => {
    if (!result[0][0].id) {
      res.json({ error: "Wrong Password" });
      console.log(0);
    } else {
      bcrypt.compare(user.oldPassword, result[0][0].pass).then((match) => {
        if (!match) {
          res.json({ error: "Wrong Password" });
        } else {
          bcrypt.hash(user.newPassword, 10).then((hash) => {
            db.query("call update_password(?,?);", [User.id, hash]);
            res.json("Change Password Successful!");
          });
        }
      });
    }
  });
});

// Show all deleted posts of a user (15) (Dong)
app.get("/deleted/posts", validateToken, (req, res) => {
  UserId = req.user.id;
  db.query("call get_deleted_posts(?);", UserId, (err, result) => {
    res.json(result[0]);
  });
});

// Delete permanently a post (16) (Dong)
app.delete("/post/delete/permant/:id", validateToken, (req, res) => {
  UserId = req.user.id;
  PostId = req.params.id;
  db.query("call delete_post_permant(?,?);", [PostId, UserId]);
  res.json("Delete Permanently!");
});

// Edit post (17) (Vy)
app.put("/post/edit", validateToken, (req, res) => {
  const post = req.body;
  db.query("call update_post(?,?,?);", [
    post.postId,
    post.newTitle,
    post.newPostText,
  ]);
  res.json("Edit post successful!");
});

app.listen(9998, () => {
  console.log("Server running on port 9998");
});
