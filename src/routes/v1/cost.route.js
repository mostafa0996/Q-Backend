const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const costValidation = require('../../validations//cost.validation');
const costController = require('../../controllers/cost.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(costValidation.createCost), costController.createCost)
  .get(authInfo(admin), validate(costValidation.getCosts), costController.getCosts);


router
  .route('/:id')
  .get(auth(admin), validate(costValidation.getCost), costController.getCosts)
  .put(auth(admin), validate(costValidation.updateCost), costController.updateCost)
  .delete(auth(admin), validate(costValidation.deleteCost), costController.deleteCost);

module.exports = router;
