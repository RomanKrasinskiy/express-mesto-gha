const User = require("../models/user");
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER,
} = require("../errors/errors");

module.exports.getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => res.status(INTERNAL_SERVER).send({ message: "Ошибка сервера." }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if ( err instanceof mongoose.Error.CastError || mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({message: "Переданы некорректные данные при создании пользователя."});
      }
      return res.status(INTERNAL_SERVER).send({ message: "Ошибка сервера." });
    });
};

module.exports.getUser = (req, res) => {
  return User.findById(req.user._id)
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError || mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: "Пользователь по указанному _id не найден."});
      }
      return res.status(INTERNAL_SERVER).send({ message: "Ошибка сервера." });
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {new: true, runValidators: true})
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError || mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({message: "Переданы некорректные данные при обновлении профиля."});
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: "Пользователь с указанным _id не найден." });
      }
      return res.status(INTERNAL_SERVER).send({ message: "Ошибка сервера." });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true }
  )
    .then((user) => res.status(OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError || mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({message: "Переданы некорректные данные при обновлении аватара."});
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: "Пользователь с указанным _id не найден." })}
      return res.status(INTERNAL_SERVER).send({ message: "Ошибка сервера." });
    });
};
