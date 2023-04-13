const mongoose = require('mongoose');
const Card = require('../models/card');

const { OK, CREATED } = require('../answersServer/success');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER,
} = require('../answersServer/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((card) => res.status(OK).send(card))
    .catch(() => res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .orFail()
    .populate('likes')
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с данным id не найдена.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .orFail()
    .populate('owner')
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с таким таким id не найдена.' });
      }
      return res.status(OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      if (err instanceof (mongoose.Error.DocumentNotFoundError)) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с данным id не найдена.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Ошибка сервера.' });
    });
};
