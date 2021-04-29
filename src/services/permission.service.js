const { Permission } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createPermission = async (Body) => {
  const object = await Permission.create(Body);
  return object;
};

const queryPermission = async (filter, options, req, Check) => {
  const object = await Permission.paginate(filter, options, req, Check);
  return object;
};


const getPermissionById = async (PermissionId) => {
  return Permission.findById(PermissionId);
};


const updatePermissionById = async (PermissionId, updateBody) => {
  const object = await getPermissionById(PermissionId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  return object;
};


const deletePermissionById = async (PermissionId) => {
  const object = await getPermissionById(PermissionId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  await object.remove();
  return {
    code: httpStatus.OK,
    message: i18next.t('Success')
  };
};


module.exports = {
  createPermission,
  queryPermission,
  getPermissionById,
  updatePermissionById,
  deletePermissionById
};
