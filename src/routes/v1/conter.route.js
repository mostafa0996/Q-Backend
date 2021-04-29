const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const counterValidation = require('../../validations/counter.validation');
const counterController = require('../../controllers/counter.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(counterValidation.createCounters), counterController.createCounter)
  .get(authInfo(admin), validate(counterValidation.getCounters), counterController.getCounters);


router
  .route('/:id')
  .put(auth(admin), validate(counterValidation.updateCounters), counterController.updateCounter)
  .delete(auth(admin), validate(counterValidation.deleteCounters), counterController.deleteCounter);


module.exports = router;
