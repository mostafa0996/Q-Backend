const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const permissionValidation = require('../../validations/permission.validation');
const permissionController = require('../../controllers/permissions.controller');
const { admin } = require('../../config/contant');
const authInfo = require('../../middlewares/authInfo');

const router = express.Router();


router
  .route('/')
  .post(auth(admin), validate(permissionValidation.createPermissions), permissionController.createPermission)
  .get(authInfo(admin), validate(permissionValidation.getPermissions), permissionController.getPermissions);


router
  .route('/:id')
  .get(auth(admin), validate(permissionValidation.getPermission), permissionController.getPermission)
  .put(auth(admin), validate(permissionValidation.updatePermissions), permissionController.updatePermission)
  .delete(auth(admin), validate(permissionValidation.deletePermissions), permissionController.deletePermission);

module.exports = router;
