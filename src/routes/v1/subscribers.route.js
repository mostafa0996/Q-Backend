const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const subscriberValidation = require('../../validations/subscriber.validation');
const subscriberController = require('../../controllers/subscriber.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();
router
  .route('/')
  .post(validate(subscriberValidation.createSubscriber), subscriberController.createSubscriber)
  .get(authInfo(), validate(subscriberValidation.getSubscribers), subscriberController.getSubscribers);


router
  .route('/:id')
  .get(auth(admin), validate(subscriberValidation.getSubscriber), subscriberController.getSubscriber)
  .put(validate(subscriberValidation.updateSubscriber), subscriberController.updateSubscriber)
  .delete(auth(admin), validate(subscriberValidation.deleteSubscriber), subscriberController.deleteSubscriber);


module.exports = router;
