const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/audit.controller');
const { listAudits } = require('../../validations/audit.validation');

const router = express.Router();

router
  .route('/')

  .get(validate(listAudits), controller.list)


module.exports = router