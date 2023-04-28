const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../answersServer/errors');

const auth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  // let payload;
  try {
    const verify = jwt.verify(token, 'secret-key');
    req.user = verify.payload;
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Ошибка авторизации' });
  }
  next();
};
module.exports = { auth };
