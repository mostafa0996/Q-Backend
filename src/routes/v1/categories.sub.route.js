const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/categories.sub.validation');
const categoryController = require('../../controllers/categories.sub.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();



router
  .route('/')
  .post(auth(admin), validate(categoryValidation.createCategories), categoryController.createCategory)
  .get(authInfo(admin), validate(categoryValidation.getCategories), categoryController.getCategories);


router
  .route('/:id')
  .get(auth(admin), validate(categoryValidation.getCategory), categoryController.getCategory)
  .put(auth(admin), validate(categoryValidation.updateCategories), categoryController.updateCategory)
  .delete(auth(admin), validate(categoryValidation.deleteCategories), categoryController.deleteCategory);


module.exports = router;
