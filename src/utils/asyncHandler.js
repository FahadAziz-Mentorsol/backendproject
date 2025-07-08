const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };

// this is an higher order function that returns an async function

// const asyncHandler = () => async (req, res, next) => {
//   try {
//   } catch (error) {
//     res.status(error.status || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
