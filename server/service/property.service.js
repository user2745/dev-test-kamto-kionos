const mongoose = require('mongoose');
var Grid = require('gridfs-stream');

const helpers = require('../providers/helper');
var propertyType = require('../models/propertyTypes');
var Property = require('../models/property');

var gfs;
var conn = mongoose.connection;
conn.on('connected', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('imageMeta');
});

class PropertyService {
  
  async propertyTypeList() {
    return propertyType.find({ is_active: true });
  }

  async addPropertyType(propertyTypeData) {
    const proptyp = new propertyType();
    proptyp.title = propertyTypeData.title;
    proptyp.type = propertyTypeData.type;
    proptyp.createdOn = Date.now();

    return proptyp.save();
  }

  async addNewProperty(propertyData, files) {
    const imgs = [];
    if (files && files.length) {
      files.forEach((file) => imgs.push(file.filename));
    }

    const slug = await helpers.slugGenerator(propertyData.title, 'title', 'property');
    propertyData.slug = slug;
    propertyData.type = propertyData.Proptype;
    propertyData.cornrPlot = !!propertyData.cornrPlot;
    propertyData.images = imgs;
    propertyData.imgPath = 'properties';
    if (!propertyData.isSociety) {
      propertyData.flatNo = '';
      propertyData.societyName = '';
    }

    const prop = new Property(propertyData);
    return prop.save();
  }

  async getUserList(userId) {
    return Property.find({ isActive: true, userId })
      .populate('city', 'name')
      .populate('state', 'name')
      .populate('type', 'title');
  }

  async getSingleProperty(propertySlug) {
    const result = await Property.findOne({ slug: propertySlug })
      .populate('city', 'name')
      .populate('state', 'name')
      .populate('type', 'title');

    if (!result) {
      throw new Error('Property not found');
    }

    let files = [];
    if (result.images && result.images.length) {
      files = await gfs.files.find({ filename: { $in: result.images } }).toArray();
    }

    return { result, files };
  }

  async getFullList() {
    return Property.find({ isActive: true })
      .populate('city', 'name')
      .populate('state', 'name')
      .populate('type', 'title')
      .populate('userId', 'name');
  }

  async markAsSold(propertySlug, status) {
    const result = await Property.updateOne({ slug: propertySlug }, { status });
    const modified = typeof result.modifiedCount === 'number' ? result.modifiedCount : result.nModified;
    if (modified !== 1) {
      throw new Error('Error in updating property');
    }
    return result;
  }

  async filterProperties(filters) {
    const query = {};
    if (filters.propertyFor) query.propertyFor = { $in: filters.propertyFor.split(',') };
    if (filters.type) query.type = { $in: filters.type.split(',') };
    if (filters.city) query.city = { $in: filters.city.split(',') };
    if (filters.userId) query.userId = filters.userId;
    if (filters.notUserId) query.userId = { $ne: filters.notUserId };
    if (filters.status) query.status = { $in: filters.status.split(',') };

    return Property.find(query)
      .populate('city', 'name')
      .populate('state', 'name')
      .populate('type', 'title')
      .populate('userId', 'name');
  }

  async testController() {
    return Property.find({ updatedOn: { $gte: '2019-04-01' } });
  }

  async getGFSImageStream(filename) {
    const file = await gfs.files.findOne({ filename });
    if (!file || file.length === 0) {
      const err = new Error('No file exists');
      err.status = 404;
      throw err;
    }

    if (file.contentType !== 'image/jpeg' && file.contentType !== 'image/png') {
      const err = new Error('Not an image');
      err.status = 404;
      throw err;
    }

    return gfs.createReadStream(file.filename);
  }
}

module.exports = new PropertyService();