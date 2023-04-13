const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND } = require('./answersServer/errors');

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();
mongoose.connect(MONGODB_URL, { useNewUrlParser: true });

app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: '643585e54eaadc9456865a2c' };
  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(NOT_FOUND).send({ message: 'По указанному url ничего нет.' }));

app.listen(PORT, () => {
  console.log('Сервер работает');
});
