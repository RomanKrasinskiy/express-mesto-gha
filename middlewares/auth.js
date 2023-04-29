const jwt = require('jsonwebtoken');
const AuthError = require('../answersServer/customsErrors/AuthError');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  let payload;
  const token = req.cookies.jwt;
  if (!token) {
    next(new AuthError('Необходимо авторизоваться'));
    return;
  }
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new AuthError('Необходимо авторизоваться'));
    return;
  }
  req.user = payload;
  next();
};
module.exports = auth;
