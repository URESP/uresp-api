const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tenantsType = ["boy", "girl", "couple", "married couple", "family" ];
const propertySchema = new mongoose.Schema({
	"propertyType":{
		"type":"String",
		required: true
	},
	"area":{
		"type":"String",
		required: true
	},
	"loc" :  { 
		"type": {
			type:"String"
		}, 
		coordinates: [Number]
	},
	"owner":{
		"type":Schema.Types.ObjectId,
		required: true
	},
	"preferredTenants":{
		"type":"String",
		enum: tenantsType
	},
	"booked":{
		"type":Boolean
	},
	"amenities":{
		"type":"Array",
		"items":{
			type:"String"
		}
	},
	"description":{
		"type":"String"
	},
	"address":{
		"type":"String"
	},
	"imageUrls":{
		type:"Array",
		"items":{
			type:"String"
		}
	},
	"pricing":{
		"type":"Object",
		properties:{
			"rental":{
				"Deposit":{
					"type":"Number"
				},
				"monthlyRent":{
					"type":"Number"
				}
			},
			"costForBuying":{
				"type":"Number"
			}
		}
	}
},{timestamps:true})


propertySchema.statics = {
	/**
   * Get property
   *
   * @param {ObjectId} id - The objectId of property.
   * @returns {Promise<Property, APIError>}
   */
   async get(id) {
    try {
      let property;

      if (mongoose.Types.ObjectId.isValid(id)) {
        property = await this.findById(id).exec();
      }
      if (property) {
        return property;
      }

      throw new APIError({
        message: 'property does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
    /**
   * List properties in descending order of 'createdAt' timestamp.
   *
   * @param {number} page - Number of page to be returned.
   * @param {number} perPAge - Limit number of properties to be returned.
   * @returns {Promise<User[]>}
   */
	  list({
	    page = 1,
	    perPage = 30,
	    lat,
	    long,
	    radians
	  }) {
	    const query = {
		    "loc" : {
		        $geoWithin : {
		            $centerSphere : [[lat,long], radians ]
		        }
		    }
		}
	    return this.find(query)
	      .sort({ createdAt: -1 })
	      .skip(perPage * (page - 1))
	      .limit(perPage)
	      .exec();
	  }
}

module.exports = mongoose.model('Property', propertySchema);