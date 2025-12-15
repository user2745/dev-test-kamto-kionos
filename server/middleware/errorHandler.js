const notFound = (req, res, next) => {
  const err = new Error("Route Not Found");
  err.status = 404;
  next(err);
};


const errorHandler = (error) => {
  try {
    if (typeof error !== "string") {
      console.error("Invalid error format. Expected a string.");
      return;
    }

    console.error(" An error occurred:", error);

  } catch (globalError) {
    console.error("Unexpected error inside errorHandler:", globalError.message);
  }
};

module.exports = { notFound, errorHandler };