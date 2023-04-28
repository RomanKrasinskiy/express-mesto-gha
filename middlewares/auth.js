const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../answersServer/errors');

module.exports = (req, res, next) => {
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
    payload = jwt.veryfy(token, 'secret-key');
    req.user = payload;
    next();
  } catch (err) {
    res
      .status(UNAUTHORIZED)
      .send({ message: 'Ошибка авторизации' });
  }
};
