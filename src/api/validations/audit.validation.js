const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Property = require('../models/property.model');

module.exports = {

  // GET /v2/properties
  listAudits: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      range: Joi.number().min(0).required()
    }
  }
}