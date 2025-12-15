const CommonService = require('../service/common.service');

module.exports = {
  getStateList: async (req, res) => {
    try {
      const states = await CommonService.getStateList();
      res.status(200).json(states);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  addState: async (req, res) => {
    try {
      const result = await CommonService.addState(req.body);
      res.status(200).json({ message: 'State added successfully', data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getAllCities: async (req, res) => {
    try {
      const cities = await CommonService.getAllCities();
      res.status(200).json(cities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getCityList: async (req, res) => {
    try {
      const cities = await CommonService.getCityList(req.params.state_id);
      res.status(200).json(cities);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  addCity: async (req, res) => {
    try {
      const result = await CommonService.addCity(req.body);
      res.status(200).json({ message: 'City added successfully', data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  removeCity: async (req, res) => {
    try {
      const result = await CommonService.removeCity(req.params.cityId);
      res.status(200).json({ message: 'City removed successfully', data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  checkemailAvailability: async (req, res) => {
    try {
      const isAvailable = await CommonService.checkEmailAvailability(req.params.email);
      res.status(200).json({ response: !isAvailable });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}