const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const testimonialsValidation = require('../../validations/testimonials.validation');
const testimonialsController = require('../../controllers/testimonials.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(testimonialsValidation.createTestimonialss), testimonialsController.createTestimonials)
  .get(authInfo(admin), validate(testimonialsValidation.getTestimonialss), testimonialsController.getTestimonialss);


router
  .route('/:id')
  .put(auth(admin), validate(testimonialsValidation.updateTestimonialss), testimonialsController.updateTestimonials)
  .delete(auth(admin), validate(testimonialsValidation.deleteTestimonialss), testimonialsController.deleteTestimonials);


module.exports = router;
