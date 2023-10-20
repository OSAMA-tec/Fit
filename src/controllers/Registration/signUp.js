const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const saltRounds = 10;

const signUp = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const existingUserEmail = await User.findOne({ email });
    const existingUserUsername = await User.findOne({ username });

    if (existingUserEmail) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    if (existingUserUsername) {
      return res.status(400).json({ error: 'A user with this username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    await user.save();

    const jwtSecret = user.role === 'admin' ? process.env.JWT_SECRET_Admin : process.env.JWT_SECRET;
    const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: "30d" }
    );

    user.token = token;

    res.status(201).json({ message: 'User created successfully', TOKEN: token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

module.exports = { signUp };