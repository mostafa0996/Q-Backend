const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const typeValidation = require('../../validations/type.validation');
const typeController = require('../../controllers/type.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(typeValidation.createTypes), typeController.createType)
  .get(authInfo(admin), validate(typeValidation.getTypes), typeController.getTypes);


router
  .route('/:id')
  .get(auth(admin), validate(typeValidation.getType), typeController.getType)
  .put(auth(admin), validate(typeValidation.updateTypes), typeController.updateType)
  .delete(auth(admin), validate(typeValidation.deleteTypes), typeController.deleteType);


module.exports = router;
