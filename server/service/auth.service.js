const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userM = require("../models/users");
const { secretKey } = require("../config/config");

class AuthService {
  async login(emailPhone, password) {
    if (!emailPhone || !password) {
      throw { status: 400, message: "Email/phone and password are required" };
    }

    const loginType = isNaN(emailPhone) ? "email" : "phoneNo";
    const user = await userM.findOne({ [loginType]: emailPhone });

    if (!user) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const token = jwt.sign({
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        isAdmin: user.isAdmin
      }
    }, secretKey);

    return { message: "Login Successful", token };
  }

  async register(userData) {
    const { fname, lName, email, phoneNo, state, city, pincode, user_type, password } = userData;

    if (!fname || !lName || !email || !phoneNo || !password) {
      throw { status: 400, message: "All fields are required" };
    }

    const hash = await bcrypt.hash(password, 10);
    
    const user = new userM({
      fname,
      lname: lName,
      email,
      phoneNo,
      state,
      city,
      pincode,
      userType: user_type,
      password: hash,
      createdOn: new Date()
    });

    const savedUser = await user.save();
    return { message: "User Added Successfully", id: savedUser._id };
  }

  async getUsers() {
    const users = await userM.find();
    return { message: "Success", data: users };
  }

  async changePassword(userId, newPassword) {
    if (!userId || !newPassword) {
      throw { status: 400, message: "User ID and password are required" };
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await userM.updateOne({ _id: userId }, { password: hash });

    return { message: "Password Changed Successfully" };
  }
}

module.exports = new AuthService();