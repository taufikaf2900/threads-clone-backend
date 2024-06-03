const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errMessage = err.message || 'Internal Server Error';

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errMessage = 'Access token expired, please relogin';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errMessage = 'Unauthenticated;';
  }

  res.status(statusCode).json({
    success: false,
    message: errMessage,
  });
};

export default errorMiddleware;
