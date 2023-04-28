const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../answersServer/errors');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  if (!token) {
    res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  try {
    payload = jwt.veryfy(token, 'secret-key');
  } catch (err) {
    res
      .status(UNAUTHORIZED)
      .send({ message: 'Ошибка авторизации' });
  }
  req.user = payload;
  next();
};

module.exports = { auth };
