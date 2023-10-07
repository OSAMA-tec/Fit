const User = require('../../models/User');
const bcrypt = require('bcrypt');
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
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

module.exports = { signUp };