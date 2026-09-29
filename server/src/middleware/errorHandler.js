const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  response.status(500).json({
    success: false,
    message: "Internal server error"
  });
};

export default errorHandler;
