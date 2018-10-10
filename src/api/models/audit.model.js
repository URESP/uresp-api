const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const auditSchema = new mongoose.Schema({
	"user":{
		type:Object
	},
	"entity":{
		type:String,
		required:true
	},
	"apiPath":{
		type:String	
	},
	"errorType":{
		type:String,
		required:true	
	},
	"errorMessage":{
		type:String,
		required:true	
	},
	"stackTrace":{
		type:String,
		required:true
	}
},{timestamps:true,strict:false})

auditSchema.statics = {
	list({
		page = 1,
	    perPage = 30,
	    range
	}) {
		let now = new Date
		let targetDate = new Date(now.setDate(now.getDate()-range))
		targetDate = targetDate.toISOString()
		const query = {
			createdAt:{
				"$gte":targetDate
			}
		}
	    return this.find(query)
	      .sort({ createdAt: -1 })
	      .skip(perPage * (page - 1))
	      .limit(perPage)
	      .exec();
	}
}

module.exports = mongoose.model('Audit', auditSchema,'Audit');