const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../answersServer/errors');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  let payload;
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: token });
  }
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
module.exports = auth;
