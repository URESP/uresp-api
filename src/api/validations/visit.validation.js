const Joi = require('joi');

module.exports = {

  // GET /v1/visits
  listVisits: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      propertyId: Joi.objectId().required()
    }
  },

  // POST /v1/visits
  createVisit: {
    body: {
      property: Joi.objectId().required(),
      tenant: Joi.objectId().required(),
      owner: Joi.objectId().required(),
      from: Joi.date().iso().required(),      
      to: Joi.date().iso().required()      
    }
  },

  // PUT /v1/visits/:visitId
  replaceVisit: {
    body: {
       property: Joi.objectId().required(),
      tenant: Joi.objectId().required(),
      owner: Joi.objectId().required(),
      from: Joi.date().iso().required(),      
      to: Joi.date().iso().required()
    },
    params: {
      visitId: Joi.objectId().required(),
    }
  },

  // PATCH /v1/visits/:visitId
  updateVisit: {
    body: {
       property: Joi.objectId().required(),
      tenant: Joi.objectId().required(),
      owner: Joi.objectId().required(),
      from: Joi.date().iso().required(),      
      to: Joi.date().iso().required()
    },
    params: {
      visitId: Joi.objectId().required(),
    }
  }
};
