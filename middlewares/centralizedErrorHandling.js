module.exports.centralizedErrorHandling = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? message
      : message,
  });
  next();
};
