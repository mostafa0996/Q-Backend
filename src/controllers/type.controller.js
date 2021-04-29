const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { typeService } = require('../services');
const i18next = require('i18next');
const { admin } = require('../config/contant');

const createType = catchAsync(async (req, res) => {
  delete req.body._id;
  const Type = await typeService.createtype(req.body);
  res.status(httpStatus.CREATED).send(Type);
});

const getTypes = catchAsync(async (req, res) => {


  const filter = pick(req.query, ['name', 'status', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }
  if (!req.user || req.user.role !== admin) {
    filters.push({ active: 1 })
  }
  const result = await typeService.querytype(filters, options, req, { scheme: 'Type' });
  res.send(result);
});


const getType = catchAsync(async (req, res) => {
  const Type = await typeService.gettypeById(req.params.id);
  if (!Type) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  res.send(Type);
});

const updateType = catchAsync(async (req, res) => {
  const Type = await typeService.updatetypeById(req.params.id, req.body);
  res.send(Type);
});

const deleteType = catchAsync(async (req, res) => {
  const Type = await typeService.deletetypeById(req.params.id);
  res.send(Type);
});

module.exports = {
  createType,
  getType,
  getTypes,
  updateType,
  deleteType,
};
