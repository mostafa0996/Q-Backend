const express = require('express');
const authInfo = require('../../middlewares/authInfo');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const shiopmentsValidation = require('../../validations/shiopments.validation');
const shipmentsController = require('../../controllers/shipments.controller');
const router = express.Router();
const { admin, driver, normal } = require('../../config/contant');




router
  .route('/assignDriver/:id')
  .put(auth(admin), validate(shiopmentsValidation.assignDriver), shipmentsController.assignDriver)
router
  .route('/assignCompany/:id')
  .put(auth(admin), validate(shiopmentsValidation.assignCompany), shipmentsController.assignCompany)
router
  .route('/acceptOrReject/:id')
  .put(auth(admin), validate(shiopmentsValidation.acceptOrReject), shipmentsController.acceptOrReject)


router
  .route('/cancelShipment/:id')
  .put(auth(admin), validate(shiopmentsValidation.cancelShipment), shipmentsController.cancelShipment)

router
  .route('/driver/updateStatus/:id')
  .put(auth(driver), validate(shiopmentsValidation.UpdateStatus), shipmentsController.updateStatus)

router
  .route('/tag/:tag')
  .get(authInfo(), validate(shiopmentsValidation.getTag), shipmentsController.getShipmentByTag)


router.post('/guest/otpSend', validate(shiopmentsValidation.otpSend), shipmentsController.otpSend);
router
  .route('/guest/')
  .post(authInfo(), validate(shiopmentsValidation.createGuest), shipmentsController.createShipmentsGuest)


router
  .route('/')
  .post(authInfo(), validate(shiopmentsValidation.create), shipmentsController.createShipments)
  .get(auth(normal), validate(shiopmentsValidation.query), shipmentsController.getShipmentss);

router
  .route('/orderCount')
  .get(auth(normal), validate(shiopmentsValidation.query), shipmentsController.getShipmentsCount);


router
  .route('/:id')
  .get(auth(normal), validate(shiopmentsValidation.get), shipmentsController.getShipments)
  .put(auth(admin), validate(shiopmentsValidation.update), shipmentsController.updateShipments)
  .delete(auth(admin), validate(shiopmentsValidation.delete_shipments), shipmentsController.deleteShipments);




module.exports = router;
