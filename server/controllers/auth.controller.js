const authService = require("../service/auth.service");

module.exports = {
  userLogin: async (req, res) => {
    try {
      const result = await authService.login(req.body.emailPhone, req.body.password);
      res.status(200).json(result);
    } catch (err) {
      const status = err.status || 500;
      const message = err.message || "Something went wrong";
      console.error("Login error:", err);
      res.status(status).json({ message });
    }
  },

  userRegistration: async (req, res) => {
    try {
      const result = await authService.register(req.body);
      res.status(200).json(result);
    } catch (err) {
      const status = err.status || 500;
      const message = err.message || "Something went wrong";
      console.error("Registration error:", err);
      res.status(status).json({ message });
    }
  },

  userList: async (req, res) => {
    try {
      const result = await authService.getUsers();
      res.status(200).json(result);
    } catch (err) {
      console.error("User list error:", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  changePass: async (req, res) => {
    try {
      const result = await authService.changePassword(req.body._id, req.body.password);
      res.status(200).json(result);
    } catch (err) {
      const status = err.status || 500;
      const message = err.message || "Something went wrong";
      console.error("Change password error:", err);
      res.status(status).json({ message });
    }
  }
};
