const userService = require('../service/users.service');
module.exports = {
  getUserDetails: async (req, res) => {
    try {
      const result = await userService.getUserDetails(req.params.userId);
      res.status(result.status).send(result.data? result.data : { message: result.message } );
    } catch (error) {
      const status = error.status || 500;
      const message = error.message || "Internal Server Error";
      res.status(status).json({ message });      
    }
  }
}