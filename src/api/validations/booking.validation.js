const Joi = require('joi');

module.exports = {

  // GET /v1/bookings
  listBookings: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      propertyId: Joi.objectId().required()
    }
  },

  // POST /v1/bookings
  createBooking: {
    body: {
      property: Joi.objectId().required(),
      tenant: Joi.objectId().required(),
      owner: Joi.objectId().required(),
      from: Joi.date().iso().required(),      
      to: Joi.date().iso().required(),
      deposit: Joi.number().required(),
      monthlyRent: Joi.number().required()     
    }
  },

  // PUT /v1/bookings/:bookingId
  replaceBooking: {
    body: {
       property: Joi.objectId().required(),
      tenant: Joi.objectId().required(),
      owner: Joi.objectId().required(),
      from: Joi.date().iso().required(),      
      to: Joi.date().iso().required(),
      deposit: Joi.number().required(),
      monthlyRent: Joi.number().required()
    },
    params: {
      bookingId: Joi.objectId().required(),
    }
  },

  // PATCH /v1/bookings/:bookingId
  updateBooking: {
    body: {
       property: Joi.objectId().required(),
      tenant: Joi.objectId().required(),
      owner: Joi.objectId().required(),
      from: Joi.date().iso().required(),      
      to: Joi.date().iso().required(),
      deposit: Joi.number().required(),
      monthlyRent: Joi.number().required()
    },
    params: {
      bookingId: Joi.objectId().required(),
    }
  }
};
