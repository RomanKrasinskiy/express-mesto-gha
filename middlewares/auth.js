const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../answersServer/errors');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Не удалось авторизоваться' });
  }
  let verify;
  try {
    verify = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Ошибка авторизации' });
  }
  req.user = verify;
  next();
};
module.exports = auth;
