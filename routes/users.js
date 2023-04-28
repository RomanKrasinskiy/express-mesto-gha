const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
// const { regAvatarURL } = require('../utils/regulars');
const {
  getUsers,
  getUser,
  getCurrentUserInfo,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/w{0,3}?[a-z0-9-]{1,}\..+#?/i).required(),
  }),
}), updateAvatar);

const validateFields = (req, res, next) => {
  const allowedFields = ['name', 'about', 'avatar'];
  const fields = Object.keys(req.body);
  const invalidFields = fields.filter((field) => !allowedFields.includes(field));
  if (invalidFields.length !== 0) {
    res.status(400).send({ message: 'Запрос содержит недопустимые поля' });
  } else {
    next();
  }
};
router.patch('/me', validateFields);
router.patch('/me/avatar', validateFields);

module.exports = router;
