const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User'); 

dotenv.config();

const verifyToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.decode(token);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).send("Invalid Token");
    }

    const jwtSecret = user.role === 'admin' ? process.env.JWT_SECRET_Admin : process.env.JWT_SECRET;

    jwt.verify(token, jwtSecret);

    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

module.exports = verifyToken;