const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { permissionService } = require('../services');
const i18next = require('i18next');
const mongoose = require("mongoose");


const createPermission = catchAsync(async (req, res) => {
  delete req.body._id;
  const Permission = await permissionService.createPermission(req.body);
  res.status(httpStatus.CREATED).send(Permission);
});

const getPermissions = catchAsync(async (req, res) => {


  const filter = pick(req.query, ['keyword', 'user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ title: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }

  if (filter.user) {
    filters.push({ user: new mongoose.Types.ObjectId(filter.user) })
  }

  const result = await permissionService.queryPermission(filters, options, req, { scheme: 'Cities' });
  res.send(result);
});


const getPermission = catchAsync(async (req, res) => {
  const Permission = await permissionService.getPermissionById(req.params.id);
  if (!Permission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  res.send(Permission);
});

const updatePermission = catchAsync(async (req, res) => {
  const Permission = await permissionService.updatePermissionById(req.params.id, req.body);
  res.send(Permission);
});

const deletePermission = catchAsync(async (req, res) => {
  const Permission = await permissionService.deletePermissionById(req.params.id);
  res.send(Permission);
});

module.exports = {
  createPermission,
  getPermission,
  getPermissions,
  updatePermission,
  deletePermission,
};
