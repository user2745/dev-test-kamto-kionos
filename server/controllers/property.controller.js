const PropertyService = require('../service/property.service');

module.exports = {
  propertyTypeList: async (req, res) => {
    try {
      const result = await PropertyService.propertyTypeList();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });      
    }
  },
  addPropertyType: async (req, res) => {
    try {
      const result = await PropertyService.addPropertyType(req.body);
      res.status(200).json({ message: 'Property type added successfully', id: result._id });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  addNewProperty: async (req, res) => {
    try {
      const result = await PropertyService.addNewProperty(req.body, req.files);
      res.status(200).json({ result, message: "Your property has been successfully posted" });
    }
    catch (err) {
      console.log({ err });
      res.status(400).json({ message: err.message });
    }
  },
  getUserList: async (req, res) => {
    try {
     const result = await PropertyService.getUserList(req.params.userId);
     res.status(200).json(result); 
    }
     catch (error) {
      res.status(400).json({ message: error.message });      
    }
  },
  getSingleProperty: async (req, res) => {
    try {
      const result = await PropertyService.getSingleProperty(req.params.propertySlug);
      res.status(200).json(result);
    }
    catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getFullList: async (req, res) => {
    try {
      const result = await PropertyService.getFullList();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });      
    }
  },
  markAsSold: async (req, res) => {
    try {
      const result = await PropertyService.markAsSold(req.params.propertySlug, req.body.status);
      res.status(200).json({ result, message: "Property has been updated Successfully" });
    }
    catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  filterProperties: async (req, res) => {
    try {
      const result = await PropertyService.filterProperties(req.query);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  testController: async (req, res) => {
    try {
      const testData = await PropertyService.testController();
      res.status(200).json(testData);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  showGFSImage: async (req, res) => {
    try {
      const readstream = await PropertyService.getGFSImageStream(req.params.filename);
      readstream.pipe(res);
    } catch (error) {
      const status = error.status || 400;
      res.status(status).json({ message: error.message });
    }
  }
}