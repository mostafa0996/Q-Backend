const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const citiesValidation = require('../../validations/city.validation');
const citiesController = require('../../controllers/city.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(citiesValidation.createCitys), citiesController.createCity)
  .get(authInfo(admin), validate(citiesValidation.getCitys), citiesController.getCitys);


router
  .route('/:id')
  .get(auth(admin), validate(citiesValidation.getCity), citiesController.getCity)
  .put(auth(admin), validate(citiesValidation.updateCitys), citiesController.updateCity)
  .delete(auth(admin), validate(citiesValidation.deleteCitys), citiesController.deleteCity);

module.exports = router;
