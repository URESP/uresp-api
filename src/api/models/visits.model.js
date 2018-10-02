const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const visitSchema = new mongoose.Schema({
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
		type:Date
	},
	"to":{
		type:Date
	}
},{timestamps:true})

visitSchema.statics = {
	/**
   * Get property
   *
   * @param {ObjectId} id - The objectId of visit.
   * @returns {Promise<Visit, APIError>}
   */
   async get(id) {
    try {
      let visit;

      if (mongoose.Types.ObjectId.isValid(id)) {
        visit = await this.findById(id)
        			.populate('property')
	      			.populate('tenant')
	      			.populate('owner')
        			.exec();
      }
      if (visit) {
        return visit;
      }

      throw new APIError({
        message: 'visit does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
    /**
   * List visits in descending order of 'createdAt' timestamp.
   *
   * @param {number} page - Number of page to be returned.
   * @param {number} perPAge - Limit number of properties to be returned.
   * @param {string} propertyId - ObjectId of property whose visits aare to be listed.
   * @returns {Promise<User[]>}
   */
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

module.exports = mongoose.model('Visit', visitSchema);