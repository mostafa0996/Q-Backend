const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');
const { normal } = require('../../config/contant');


const router = express.Router();
router.get('/register/active', validate(authValidation.active), authController.active);
router.post('/otpSend', validate(authValidation.otpSend), authController.otpSend);
router.post('/otpSendWithoutCheck', validate(authValidation.otpSendWithoutCheck), authController.otpSendWithoutCheck);
router.get('/register/sendVerificationEmail', validate(authValidation.verification), authController.verification);
router.post('/register', validate(authValidation.register), authController.register);
router.post('/registerSocial', validate(authValidation.registerSocial), authController.registerSocial);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/admins/login', validate(authValidation.loginAdmin), authController.loginAdmin);
router.get('/profile/:userId', validate(authValidation.profile), authController.profile);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.get('/forgot-password/reset-password', validate(authValidation.changePasswordView), authController.changePasswordView);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.put('/change-password-otp', validate(authValidation.resetPasswordOTP), authController.updatePassword);
router.post('/change-Password', auth(normal), validate(authValidation.changePassword), authController.changePassword);


module.exports = router;
