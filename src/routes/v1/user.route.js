const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const { admin, normal } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();



router.route('/fcm')
  .put(auth(normal), validate(userValidation.updateFcm), userController.updateFcm)

router.route('/updatePassword')
  .put(authInfo(), validate(userValidation.updatePassword), userController.updatePassword);



router.route('/activeGuest')
  .put(authInfo(), validate(userValidation.updateGuestPasswordAndActiveAccount), userController.updateGuestPasswordAndActiveAccount);

router.route('/AccpectOrRejectCompanyAccount')
  .put(authInfo(), validate(userValidation.AccpectOrRejectCompanyAccount), userController.AccpectOrRejectCompanyAccount);



router.route('/profile')
  .put(auth(normal), validate(userValidation.updateUser), userController.updateUser)
  .get(auth(normal), validate(userValidation.getUser), userController.getUser);


router
  .route('/')
  .put(auth(normal), validate(userValidation.updateUser), userController.updateUser)
  .post(auth(admin), validate(userValidation.createUser), userController.createUser)
  .get(auth(admin), validate(userValidation.getUsers), userController.getUsers);





router
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.getUserById)
  .put(auth(admin), validate(userValidation.updateUserUpdate), userController.updateUserbyadmin)
  .delete(auth(admin), validate(userValidation.deleteUser), userController.deleteUser);



router
  .route('/permission/:userId/:permissionId')
  .post(auth(admin), validate(userValidation.createUserPermission), userController.createUserPermission)
  .delete(auth(admin), validate(userValidation.deleteUserPermission), userController.deleteUserPermission);





module.exports = router;
