const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const advantageValidation = require('../../validations/advantage.validation');
const advantageController = require('../../controllers/advantage.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin),validate(advantageValidation.createAdvantage), advantageController.createAdvantage)
  .get(authInfo(), validate(advantageValidation.getAdvantages), advantageController.getAdvantages);


router
  .route('/:id')
  .get(auth(admin), validate(advantageValidation.getAdvantage), advantageController.getAdvantage)
  .put(auth(admin), validate(advantageValidation.updateAdvantage), advantageController.updateAdvantage)
  .delete(auth(admin), validate(advantageValidation.deleteAdvantage), advantageController.deleteAdvantage);


module.exports = router;
