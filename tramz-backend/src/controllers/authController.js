const User = require('../models/User');
const jwt = require('jsonwebtoken');

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));
const clean = (v) => String(v || '').trim();

exports.register = async (req, res) => {
  const username = clean(req.body.username);
  const password = String(req.body.password || '');
  const email = clean((req.body.email || '').toLowerCase());
  try {
    // Basic validation
    if (!username || username.length < 3 || username.length > 32) {
      return res.status(400).json({ msg: 'Invalid username' });
    }
    if (!password || password.length < 6 || password.length > 128) {
      return res.status(400).json({ msg: 'Invalid password' });
    }
    if (!email || !isEmail(email) || email.length > 254) {
      return res.status(400).json({ msg: 'Invalid email' });
    }
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ msg: 'Unable to register user' });
  }
};

exports.login = async (req, res) => {
  const username = clean(req.body.username);
  const password = String(req.body.password || '');
  try {
    if (!username || !password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }
    
    const jwtOpts = {
      expiresIn: '24h',
      issuer: process.env.JWT_ISSUER || 'tramz-backend',
      audience: process.env.JWT_AUDIENCE || 'tramz-users',
    };
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role }, 
      process.env.JWT_SECRET, 
      jwtOpts
    );
    
    res.json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};