const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { OK, CREATED } = require('../answersServer/success');
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER,
} = require('../answersServer/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' }));
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь c таким id не найден.' });
      }
      return res.status(OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля.',
          });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(BAD_REQUEST)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара.',
          });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: matched._id },
        'secret-key',
        { expiresIn: 3600 * 24 * 7 },
      );
      res.status(OK)
        .cookie('token', token, {
          maxAge: 3600 * 24 * 365,
          httpOnly: true,
        });
      // аутентификация успешна
      return res.send({ message: 'Ваш токен сохранён!' });
    })
    .catch(() => {
      res.status(UNAUTHORIZED).send({ message: 'Ошибка авторизации' });
    });
};
module.exports.getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.status(OK).send(user))
    .catch((err) => next(err));
};
