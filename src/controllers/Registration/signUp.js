const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const saltRounds = 10;

const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if username, email, and password are provided
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
    // Check if a user with the same email or username already exists
    const existingUserEmail = await User.findOne({ email });
    const existingUserUsername = await User.findOne({ username });

    if (existingUserEmail) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    if (existingUserUsername) {
      return res.status(400).json({ error: 'A user with this username already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create token
    const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );

    // Save user token
    user.token = token;

    // Respond with token and user data
    res.status(201).json({ message: 'User created successfully', TOKEN: token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

module.exports = { signUp };
