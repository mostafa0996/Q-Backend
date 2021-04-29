const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const addressValidation = require('../../validations/address.validation');
const addressController = require('../../controllers/address.controller');
const { admin, normal } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(normal), validate(addressValidation.createAddress), addressController.createAddress)
  .get(auth(normal), validate(addressValidation.getAddress), addressController.getAllAddresses);


router
  .route('/:id')
  .get(auth(normal), validate(addressValidation.getAddres), addressController.getAddress)
  .put(auth(normal), validate(addressValidation.updateAddress), addressController.updateAddress)
  .delete(auth(normal), validate(addressValidation.deleteAddress), addressController.deleteAddress);


module.exports = router;
