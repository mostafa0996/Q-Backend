const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const contactValidation = require('../../validations/contact.validation');
const contactController = require('../../controllers/contact.controller');
const router = express.Router();
const { admin } = require('../../config/contant');

router
  .route('/')
  .post(validate(contactValidation.createContact), contactController.createContact)
  .get(auth(admin), validate(contactValidation.queryContacts), contactController.getContacts);


router
  .route('/:id')
  .get(auth(admin), validate(contactValidation.getContact), contactController.getContact)
  .put(auth(admin), validate(contactValidation.updateContact), contactController.updateContact)
  .delete(auth(admin), validate(contactValidation.deleteContact), contactController.deleteContact);




module.exports = router;
