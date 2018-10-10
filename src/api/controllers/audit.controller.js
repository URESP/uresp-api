const httpStatus = require('http-status');
const { handler: errorHandler } = require('../middlewares/error');
const Audit = require('../models/audit.model');


exports.list = async (req,res,next)=>{
	try{
		let audits = await Audit.list(req.query)
		res.status(200).json(audits)
	}catch(err){
		res.status(500).json(err)
	}
}