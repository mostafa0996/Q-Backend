const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const PartnerValidation = require('../../validations/partners.validation');
const PartnerController = require('../../controllers/partners.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(PartnerValidation.createPartners), PartnerController.createPartner)
  .get(authInfo(admin), validate(PartnerValidation.getPartners), PartnerController.getPartners);


router
  .route('/:id')
  .put(auth(admin), validate(PartnerValidation.updatePartners), PartnerController.updatePartner)
  .delete(auth(admin), validate(PartnerValidation.deletePartners), PartnerController.deletePartner);


module.exports = router;
