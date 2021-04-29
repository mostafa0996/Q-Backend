const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const contentValidation = require('../../validations/content.validation');
const contentController = require('../../controllers/content.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(contentValidation.createContents), contentController.createContent)
  .get(authInfo(admin), validate(contentValidation.getContents), contentController.getContents);

router
  .route('/type/:id')
  .get(authInfo(admin), validate(contentValidation.getContents), contentController.getContent)


router
  .route('/:id')
  .put(auth(admin), validate(contentValidation.updateContents), contentController.updateContent)
  .delete(auth(admin), validate(contentValidation.deleteContents), contentController.deleteContent);


module.exports = router;
