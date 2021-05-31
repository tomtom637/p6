const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.signup = async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password: hash
  });
  try {
    await user.save();
    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
      return res.status(401).json({ error: new Error('User not found') });
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if(!valid) {
      return res.status(401).json({ error: new Error('Incorrect password') });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.RANDOM_TOKEN_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({ userId: user._id, token });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};