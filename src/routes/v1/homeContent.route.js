const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const homeContentValidation = require('../../validations/homeContent.validation');
const homeContentController = require('../../controllers/homeContent.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(homeContentValidation.createhomeContents), homeContentController.createhomeContent)
  .get(authInfo(admin), validate(homeContentValidation.gethomeContents), homeContentController.gethomeContents);


router
  .route('/:id')
  .put(auth(admin), validate(homeContentValidation.updatehomeContents), homeContentController.updatehomeContent)
  .delete(auth(admin), validate(homeContentValidation.deletehomeContents), homeContentController.deletehomeContent);


module.exports = router;
