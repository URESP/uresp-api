const httpStatus = require('http-status');
const { omit } = require('lodash');
const Property = require('../models/property.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Create new Property
 * @public
 */
exports.create = async (req, res, next) => {
  try {
  	let lat = req.body.lat
  	let long = req.body.long
  	delete req.body.lat
  	delete req.body.long
  	req.body.loc = {
  		"type" : "Point",
  		"coordinates" : [lat, long]
  	}
    const property = new Property(req.body);
    const savedProperty = await property.save();
    res.status(httpStatus.CREATED);
    res.json(savedProperty);
  } catch (error) {
  	console.log("catch in create in controller >>>>",error)
    next(error);
  }
};


/**
 * Get properties list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
  	let lat = parseFloat(req.query.lat)
  	let long = parseFloat(req.query.long)
  	let radians = parseFloat(req.query.radius)/6371
  	console.log("radians", typeof radians, radians)
  	let query = {
  		page: req.query.page,
  		perPage: req.query.perPage,
  		lat: lat || null,
  		long: long || null,
  		radians: radians || null
  	}
  	console.log("query >>>>>>>.",query)
    const properties = await Property.list(query);
    console.log("properties >>>>>>>>>>>>>>>>>>>>>.")
    res.json(properties);
  } catch (error) {
  	console.log("error >>>>>>",error)
    next(error);
  }
};

exports.load = async (req, res, next) => {
  try {
  	console.log("inside load >>>>>>>>")
    const property = await Property.get(req.params.propertyId);
    res.status(200).json(property)
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.update = async(req,res, next)=>{
	try{
		console.log("inside update >>>>>>>>")
		 let property = await Property.get(req.params.propertyId);
		 console.log("old property >>>>>>>>>..",property)
		 property = Object.assign(property,req.body)
		 console.log("new property >>>>>>>>>..",property)
		 property.save()
		 	.then(updatedProperty=>{
		 		res.status(200).json(updatedProperty)
		 	}).catch(e=>{
		 		next(e)
		 	})
	}catch(err){
		console.log("error in catch >>>>>>>>>.",err)
		return errorHandler(err, req, res);	
	}
}


exports.remove = async(req, res, next) => {
 try{
 	 const property  = await Property.get(req.params.propertyId)

	property.remove()
	.then(() => res.status(httpStatus.NO_CONTENT).end())
	.catch(e => next(e));
 }catch(e){
 	next(e)
 }
};