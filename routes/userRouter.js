const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;
    //validate

    if (!email || !password || !passwordCheck) {
      return res.status(400).json({ msg: 'please fill up all the fileds' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: 'Password length must be at least 6 !!' });
    }

    if (password !== passwordCheck) {
      return res.status(400).json({ msg: 'Password does not match!!' });
    }

    const existigUser = await User.findOne({ email: email });

    if (existigUser) {
      return res
        .status(400)
        .json({ msg: 'An Account with this email already exists.' });
    }

    if (!displayName) {
      displayName = email;
    }
    const salt = await bcrypt.genSalt();

    const passwordhash = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: passwordhash, displayName });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate
    if (!email || !password) {
      return res.status(400).json({ msg: 'please fill up all the fileds' });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: 'email does not exists in our system' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Password is Wrong!!' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (error) {}
});

module.exports = router;
