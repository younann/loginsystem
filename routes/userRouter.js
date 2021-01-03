const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

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
  } catch (error) {
    res.status(500).json({ Error: error.msg });
  }
});

router.delete('/delete', auth, async (req, res) => {
  try {
    console.log(req.user._id);
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ Error: error.msg });
  }
});

// func give back ture or false to check if user login
router.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.json(false);
    }
    const verfied = jwt.verify(token, process.env.JWT_SECRET);
    if (!verfied) {
      return res.json(false);
    }
    const user = await User.findById(verfied.id);
    if (!user) {
      return res.json(false);
    }
    return res.json(true);
  } catch (error) {
    res.status(500).json({ Error: error.msg });
  }
});

module.exports = router;
