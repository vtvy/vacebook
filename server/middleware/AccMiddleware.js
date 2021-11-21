const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const Token = req.header("Token");
  if (!Token) return res.json({ error: "User not signed in!" });

  try {
    const validToken = verify(Token, "Please Don't Break My First Website");
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
