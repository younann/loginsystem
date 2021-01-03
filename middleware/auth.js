const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res
        .status(401)
        .json({ msg: ' not authentication token , acess denied' });
    }
    const verfied = jwt.verify(token, process.env.JWT_SECRET);
    if (!verfied) {
      return res
        .status(401)
        .json({ msg: 'Token authentication token , acess denied' });
    }
    console.log(verfied);
    req.user = verfied.indexOf;

    next();
  } catch (error) {
    res.status(500).json({ Error: error.msg });
  }
};

module.exports = auth;
