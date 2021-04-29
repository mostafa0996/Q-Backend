const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bannerValidation = require('../../validations//banners.validation');
const bannerController = require('../../controllers/banners.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(bannerValidation.createBanners), bannerController.createBanner)
  .get(authInfo(admin), validate(bannerValidation.getBanners), bannerController.getBanners);


router
  .route('/:id')
  .get(auth(admin), validate(bannerValidation.getBanner), bannerController.getBanner)
  .put(auth(admin), validate(bannerValidation.updateBanners), bannerController.updateBanner)
  .delete(auth(admin), validate(bannerValidation.deleteBanners), bannerController.deleteBanner);


module.exports = router;
