const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const dotenv = require('dotenv');
const User = require('../../models/User');
dotenv.config();

const login = async (req, res) => {
  const totalStart = Date.now();
  const timings = {};

  const validationStart = Date.now();
  const { email, password, way } = req.body;

  if (way === 'google') {
    if (!email) {
      timings.validation = Date.now() - validationStart;
      timings.total = Date.now() - totalStart;
      return res.status(400).send("Email is required");
    }
  } else {
    if (!(email && password)) {
      timings.validation = Date.now() - validationStart;
      timings.total = Date.now() - totalStart;
      return res.status(400).send("Email and password are required");
    }
  }
  timings.validation = Date.now() - validationStart;

  const dbQueryStart = Date.now();
  const user = await User.findOne({ email });
  timings.dbQuery = Date.now() - dbQueryStart;

  if (user) {
    if (way !== 'google') {
      const verifyStart = Date.now();
      const isPasswordValid = await argon2.verify(user.password, password);
      timings.passwordVerification = Date.now() - verifyStart;

      if (!isPasswordValid) {
        timings.total = Date.now() - totalStart;
        return res.status(400).send("Invalid Credentials");
      }
    }

    const jwtStart = Date.now();
    const jwtSecret = user.role === 'admin' ? process.env.JWT_SECRET_Admin : process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "30d" }
    );
    timings.jwtSigning = Date.now() - jwtStart;

    user.token = token;

    timings.total = Date.now() - totalStart;

    res.status(200).json({ 
      msg: "Login Successfully!", 
      TOKEN: token, 
      user,
      timings 
    });
  } else {
    timings.total = Date.now() - totalStart;
    res.status(400).send("Invalid Credentials");
  }
};

module.exports = { login };
