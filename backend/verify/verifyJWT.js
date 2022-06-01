// import { useNavigate } from "react-router-dom";
const jwt = require("jsonwebtoken");

// const navigate = useNavigate();
async function verifyJWT(req, res, next) {
  const token = req.headers["access-token"];
  // console.log("Toke from verify file : ", token);
  if (token) {
    // console.log("Token found.");
    await jwt.verify(token, "secret_key", (err, decoded) => {
      if (err) {
        return res.send({
          isLoggedIn: false,
          message: "Failed to authenticate",
        });
      }
      req.user = {};
      req.user.id = decoded.id;
      req.user.userName = decoded.userName;
      next();
    });
  } else {
    // navigate("/login");
    res.send({
      isLoggedIn: false,
      message: "Failed to authenticate",
    });
    console.log("Token not found.");
  }
}

module.exports = verifyJWT;
