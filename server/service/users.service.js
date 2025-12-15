var users = require('../models/users');

class UserService {

  async getUserDetails(userId) {
    if (!userId) {
      throw { status: 400, message: "User ID is required" };
    }
    
    const user = await users.findOne({ _id: userId })
      .populate('city', 'name')
      .populate('state', 'name');
    
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return user;  // Just return the data
  }
}

module.exports = new UserService();