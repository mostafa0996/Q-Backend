const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notificationValidation = require('../../validations/notification.validation');
const notificationController = require('../../controllers/notificaitons.controller');
const { normal } = require('../../config/contant');
const router = express.Router();


router
  .route('/')
  .get(auth(normal), validate(notificationValidation.getNotifications), notificationController.getNotifications);

router
  .route('/:id')
  .delete(auth(normal), validate(notificationValidation.deleteNotifications), notificationController.deleteNotification);

router
  .route('/read/:id')
  .put(auth(normal), validate(notificationValidation.deleteNotifications), notificationController.readNotification);


module.exports = router;
