const httpStatus = require('http-status');
const { omit } = require('lodash');
const Booking = require('../models/bookings.model');
const User = require('../models/user.model');
const Property = require('../models/property.model');
const { handler: errorHandler } = require('../middlewares/error');
const mongoose = require('mongoose');
const Audit = require('../models/audit.model');
// const Nexmo = require('nexmo');
// const nexmo = new Nexmo({
//   apiKey: "f4f31936",
//   apiSecret: "SQ8wHlRVIFgqKOGv"
// });
const accountSid = 'AC1732ee2e4c9b4773f8039328ec1399bf';
const authToken = '580514f73f8614900540ba20bfadbc25';
const client = require('twilio')(accountSid, authToken);

  const sendSmsNotifToTenant = async (tenant,property,from,to)=>{
  	let message = `Hi ${tenant.name}, You have successfully Booked ${property.address} from ${from} till ${to}.`
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
  	let message = `Hi ${owner.name}, your property ${property.address} got booked from ${from} till ${to}`
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
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    console.log("saved visit >>>.",savedBooking)
    property["booked"] = true
    await property.save()
    await sendSmsNotifToTenant(tenant,property,req.body.from,req.body.to)
    await sendSmsNotifToOwner(owner,property,req.body.from,req.body.to)
    res.status(httpStatus.CREATED);
    res.json(savedBooking);
  } catch (err) {
  	console.log("catch in create in controller >>>>",err)
    const audit = new Audit({
        user: req.user || null,
        entity: "BOOKING",
        apiPath: "",
        errorType: "Error while Creating Booking",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
    await audit.save()
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
  	let bookings = await Booking.list(req.query)
  	console.log("visits>>>>>>>>",bookings)
  	res.status(200).json(bookings)
  } catch (err) {
  	console.log("error >>>>>>",err)
    const audit = new Audit({
        user: req.user || null,
        entity: "BOOKING",
        apiPath: "",
        errorType: "Error while Listing Booking",
        errorMessage: err.message || httpStatus[err.status],
        stackTrace: err.stack
      })
    await audit.save()
    next(err);
  }
};