const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Property = require('../models/property.model');

module.exports = {

  // GET /v2/properties
  listProperties: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      lat: Joi.string().required(),
      long: Joi.string().required(),
      radius: Joi.string().required()
    }
  },

  // POST /v2/properties
  createProperty: {
    body: {
      "propertyType":Joi.string().required(),
      "area":Joi.string().required(),
      "lat":Joi.number().required(),
      "long":Joi.number().required(),
      "owner":Joi.objectId().required(),
      "preferredTenants":Joi.string().required()
    }
  },

  // PUT /v1/properties/:propertyId
  replaceProperty: {
    body: {
      "propertyType":Joi.string().required(),
      "area":Joi.string().required(),
      "lat":Joi.number().required(),
      "long":Joi.number().required(),
      "owner":Joi.objectId().required()
    },
    params: {
      propertyId : Joi.objectId().required(),
    },
  },

  // PATCH /v1/properties/:propertyId
  updateProperty: {
    body: {
      "propertyType":Joi.string().required(),
      "area":Joi.string().required(),
      "lat":Joi.number().required(),
      "long":Joi.number().required(),
      "owner":Joi.objectId().required()
    },
    params: {
      propertyId : Joi.objectId().required(),
    }
  }
};
