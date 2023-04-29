const mongoose = require('mongoose');
const Card = require('../models/card');

const { OK, CREATED } = require('../answersServer/success');
const BadRequestError = require('../answersServer/customsErrors/BadRequestError');
const NotFoundError = require('../answersServer/customsErrors/NotFoundError');
const ForbiddenError = require('../answersServer/customsErrors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.status(OK).send(card))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким таким id не найдена.');
      }
      if (card.owner.toHexString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки.');
      }
      return card.deleteOne();
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .orFail()
    .populate('likes')
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Карточка с данным id не найдена.'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .orFail()
    .populate('owner')
    .then((card) => res.status(OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
        return;
      }
      if (err instanceof (mongoose.Error.DocumentNotFoundError)) {
        next(new NotFoundError('Карточка с данным id не найдена.'));
        return;
      }
      next(err);
    });
};
