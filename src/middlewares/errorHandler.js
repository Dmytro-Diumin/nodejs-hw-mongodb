export const errorHandler = (err, req, res) => {
  if (err.name === 'CastError') {
    res.status(400).json({
      status: 400,
      message: 'Bad Request',
      data: {
        message: `Invalid ${err.path}: ${err.value}`,
      },
    });
  } else {
    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || 'Server error',
      data: err.data || {},
    });
  }
};
