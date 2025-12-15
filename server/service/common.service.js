var state_model = require('../models/state');
var city_model = require('../models/city');
var users = require('../models/users');

class CommonService {
  async getStateList() {
    return state_model.find({ is_active: true });
  }
  async addState(stateData) {
    var state = new state_model();
    state.name = stateData.name;
    return state.save();
  }

  async getAllCities() {
    return city_model.find({ is_active: true }).populate('state_id', 'name');
  }

  async getCityList(state_id) {
    return city_model.find({ state_id: state_id, is_active: true }).populate('state_id', 'name');
  }

  async addCity(cityData) {
    var city = new city_model(cityData);
    return city.save();
  }

  async removeCity(cityId) {
    return city_model.deleteOne({ _id: cityId });
  }

  async checkEmailAvailability(email) {
    const result = await users.find({ email: email });
    return result.length > 0;
  }
}

module.exports = new CommonService();