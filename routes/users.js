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
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).message('Поле "name" должно быть валидным'),
    about: Joi.string().min(2).max(30).message('Поле "about" должно быть валидным'),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/w{0,3}?[a-z0-9-]{1,}\..+#?/i).message('Поле "avatar" должно быть валидным url-адресом'),
  }),
}), updateAvatar);

module.exports = router;
