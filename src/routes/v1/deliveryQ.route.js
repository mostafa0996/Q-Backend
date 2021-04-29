const express = require('express');
const validate = require('../../middlewares/validate');
const homeValidation = require('../../validations/home.validation');
const homeController = require('../../controllers/home.controller');
const authInfo = require('../../middlewares/authInfo');
const auth = require('../../middlewares/auth');

const { normal, admin } = require('../../config/contant');


const router = express.Router();
router.get('/home', authInfo(normal), validate(homeValidation.home), homeController.home);
router.get('/admin/home', auth(admin), validate(homeValidation.home), homeController.homeAdmin);
router.get('/website/home', authInfo(normal), validate(homeValidation.home), homeController.websiteHome);



module.exports = router;

