const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../answersServer/errors');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  let verify;
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res
      .status(UNAUTHORIZED)
      .send({ token });
  }
  // let payload;
  try {
    verify = jwt.verify(token, 'secret-key');
    req.user = verify.payload;
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: 'Ошибка авторизации' });
  }
  next();
};
module.exports = { auth };
