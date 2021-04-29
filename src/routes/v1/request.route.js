const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postValidation = require('../../validations/request.validation');
const requestController = require('../../controllers/request.controller');
const router = express.Router();
const { admin } = require('../../config/contant');

router
  .route('/')
  .post(validate(postValidation.createRequest), requestController.createRequest)
  .get(auth(admin), validate(postValidation.queryRequests), requestController.getRequests);


router
  .route('/:id')
  .get(auth(admin), validate(postValidation.getRequest), requestController.getRequest)
  .put(auth(admin), validate(postValidation.updateRequest), requestController.updateRequest)
  .delete(auth(admin), validate(postValidation.deleteRequest), requestController.deleteRequest);




module.exports = router;
