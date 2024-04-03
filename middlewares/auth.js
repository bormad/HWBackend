const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.token;

  try {
    const verifyRes = jwt.verify(token, "test");

    req.user = {
      email: verifyRes.email,
    };

    next();
  } catch (error) {
    res.redirect("/login");
  }
}

module.exports = { auth };
