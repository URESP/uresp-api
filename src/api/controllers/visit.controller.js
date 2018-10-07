const httpStatus = require('http-status');
const { omit } = require('lodash');
const Visit = require('../models/visits.model');
const User = require('../models/user.model');
const Property = require('../models/property.model');
const { handler: errorHandler } = require('../middlewares/error');
const mongoose = require('mongoose');
// const Nexmo = require('nexmo');
// const nexmo = new Nexmo({
//   apiKey: "f4f31936",
//   apiSecret: "SQ8wHlRVIFgqKOGv"
// });
const accountSid = 'AC1732ee2e4c9b4773f8039328ec1399bf';
const authToken = '580514f73f8614900540ba20bfadbc25';
const client = require('twilio')(accountSid, authToken);

  const sendSmsNotifToTenant = async (tenant,property,from,to)=>{
  	let message = `Hi ${tenant.name}, You have successfully scheduled a visit at ${property.address} from ${from} till ${to}.`
  	console.log("message in sendSmsNotifToTenant>>>>>>.",message)
	client.messages
	  .create({
	     body: message,
	     from: '+15042734015',
	     to: '+919953025397'
	   })
	  .then(message => console.log("sendSmsNotifToTenant>>>>>>>>>>",message.sid))
	  .done();

  }
  const sendSmsNotifToOwner = async (owner,property,from,to)=>{
  	let message = `Hi ${owner.name}, 1 new visit is scheduled at your property ${property.address} from ${from} till ${to}`
  	console.log("message in sendSmsNotifToOwner>>>>>>.",message)
  	client.messages
	  .create({
	     body: message,
	     from: '+15042734015',
	     to: '+919953025397'
	   })
	  .then(message => console.log("sendSmsNotifToOwner>>>>>>>>>>",message.sid))
	  .done();
  }
/**
 * Create new Property
 * @public
 */
 // const sendSmsNotifToTenant = async (tenant,property,from,to)=>{
 // 	try{
 // 		return new Promise((resolve,reject)=>{
 			
 // 			let message = `Hi ${tenant.name}, You have successfully scheduled a visit at ${property.address} from ${from} till ${to}.`
 // 			nexmo.message.sendSms(
	// 		  "URESP", String(tenant.mobile), message,
	// 		    (err, responseData) => {
	// 		      if (err) {
	// 		        console.log(err);
	// 		        reject(err)
	// 		      } else {
	// 		        console.log("sendSmsNotifToTenant >>>>>>>>>",responseData);
	// 		        resolve(responseData)
	// 		      }
	// 		    }
	// 		 );
 // 		})
 // 	}catch(e){
 // 		throw e
 // 	}
 // }
 // const sendSmsNotifToOwner = async (owner,property,from,to)=>{
 // 	try{
 // 		return new Promise((resolve,reject)=>{
 			
 // 			let message = `Hi ${owner.name}, 1 new visit is scheduled at your property ${property.address} from ${from} till ${to}`
 // 			nexmo.message.sendSms(
	// 		  "URESP", String(owner.mobile), message,
	// 		    (err, responseData) => {
	// 		      if (err) {
	// 		        console.log(err);
	// 		        reject(err)
	// 		      } else {
	// 		        console.log("sendSmsNotifToOwner >>>>>>>>>>>>",responseData);
	// 		        resolve(responseData)
	// 		      }
	// 		    }
	// 		 );
 // 		})
 // 	}catch(e){

 // 	}
 // }
exports.create = async (req, res, next) => {
  try {
  	console.log("inside schedule a visit >>>>>>>>>>>>>>>>>>")
    let property = await Property.get(req.body.property)
    console.log("property >>>>>>>>>.",property)
    let tenant = await User.get(req.body.tenant)
    console.log("tenant >>>>>>>>>.",tenant)
    let owner = await User.get(req.body.owner)
    console.log("owner >>>>>>>>>.",owner)
  	req.body.property = mongoose.Types.ObjectId(req.body.property)
  	req.body.tenant = mongoose.Types.ObjectId(req.body.tenant)
  	req.body.owner = mongoose.Types.ObjectId(req.body.owner)
    const visit = new Visit(req.body);
    const savedVisit = await visit.save();
    console.log("saved visit >>>.",savedVisit)
    await sendSmsNotifToTenant(tenant,property,req.body.from,req.body.to)
    await sendSmsNotifToOwner(owner,property,req.body.from,req.body.to)
    res.status(httpStatus.CREATED);
    res.json(savedVisit);
  } catch (error) {
  	console.log("catch in create in controller >>>>",error)
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
  	let visits = await Visit.list(req.query)
  	console.log("visits>>>>>>>>",visits)
  	res.status(200).json(visits)
  } catch (error) {
  	console.log("error >>>>>>",error)
    next(error);
  }
};
