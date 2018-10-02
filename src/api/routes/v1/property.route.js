const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/property.controller');
const {
  listProperties,
  createProperty,
  replaceProperty,
  updateProperty,
} = require('../../validations/property.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/properties List Properties
   * @apiDescription Get a list of properties
   * @apiVersion 1.0.0
   * @apiName ListProperties
   * @apiGroup Prtperty
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Properties per page
   * @apiParam  {String}             [coordinates] Coordinates of centre of 2D Sphere
   * @apiParam  {String}             [radius]     radius of 2D spehere in kms
   * 
   *
   * @apiSuccess {Object[]} users List of properties.
   */
  .get(validate(listProperties), controller.list)
  /**
   * @api {post} v1/properties Create Property
   * @apiDescription Create a new property
   * @apiVersion 1.0.0
   * @apiName CreateProperty
   * @apiGroup property
   *
   * @apiParam  {String}     propertyType      Property's propertyType
   * @apiParam  {String}     area	  		   Property's area
   * @apiParam  {String}     lat	  		   Property's latitude
   * @apiParam  {String}     long	  		   Property's longitude
   * @apiParam  {String}     owner    		   Property's owner
   * @apiParam  {String}     preferred Tenants Property's PreferredTenants
   *
   * @apiSuccess (Created 201) _id      		 Property's ObjectID
   * @apiSuccess (Created 201) propertyType      Property's propertyType
   * @apiSuccess (Created 201) area	  		     Property's area
   * @apiSuccess (Created 201) lat	  		     Property's latitude
   * @apiSuccess (Created 201) long	  		     Property's longitude
   * @apiSuccess (Created 201) owner    	     Property's owner
   * @apiSuccess (Created 201) preferred Tenants Property's PreferredTenants
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   */
  .post( validate(createProperty), controller.create);

router
  .route('/:propertyId')
    .get(controller.load)
    .put(controller.update)
    .delete(controller.remove)
  module.exports = router