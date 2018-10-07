const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookingSchema = new mongoose.Schema({
	"property":{
		type:Schema.Types.ObjectId,
		ref:'Property'
	},
	"tenant":{
		type:Schema.Types.ObjectId,
		ref:'User'

	},
	"owner":{
		type:Schema.Types.ObjectId,
		ref:'User'

	},
	"from":{
		type:Date,
		required:true
	},
	"to":{
		type:Date,
		required:true
	},
	"deposit":{
		type:Number
	},
	"monthlyRent":{
		type:Number
	}

},{timestamps:true})

bookingSchema.statics = {
	async get(id) {
	    try {
	      let booking;

	      if (mongoose.Types.ObjectId.isValid(id)) {
	        booking = await this.findById(id)
	        			.populate('property')
		      			.populate('tenant')
		      			.populate('owner')
	        			.exec();
	      }
	      if (booking) {
	        return booking;
	      }

	      throw new APIError({
	        message: 'booking does not exist',
	        status: httpStatus.NOT_FOUND,
	      });
	    } catch (error) {
	      throw error;
	    }
    },
    list({
	    page = 1,
	    perPage = 30,
	    propertyId
	  }) {
	    const query = {
		    property:mongoose.Types.ObjectId(propertyId)
		}
	    return this.find(query)
	      .populate('property')
	      .populate('tenant')
	      .populate('owner')
	      .sort({ createdAt: -1 })
	      .skip(perPage * (page - 1))
	      .limit(perPage)
	      .exec();
	  }
}

module.exports = mongoose.model('Booking', bookingSchema);