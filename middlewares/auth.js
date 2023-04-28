const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../answersServer/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
    req.user = payload;
  } catch (err) {
    res
      .status(UNAUTHORIZED)
      .send({ message: 'Ошибка авторизации' });
  }
  next();
};
module.exports = { auth };
