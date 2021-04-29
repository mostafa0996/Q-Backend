const { Cost } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');
const { normal } = require('../config/contant');
const pick = require('../utils/pick');
const mongoose = require("mongoose");


const createCost = async (Body, req) => {
  const object = await Cost.create(Body);

  req.query._id = object._id;
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter._id) {
    filters.push({ _id: new mongoose.Types.ObjectId(filter._id) })
  }

  const objectCost = await Cost.paginate(filters, options, req);
  return objectCost.results[0];
};

const queryCost = async (filter, options, req, Check) => {
  if (!req.user || req.user.role === normal) {
    const object = await Cost.paginateuser(filter, options, req);
    return object;
  } else {
    const object = await Cost.paginate(filter, options, req);
    return object;
  }
};

const getCostById = async (CostId) => {
  return Cost.findById(CostId);
};


const updateCostById = async (CostId, updateBody, req) => {
  const object = await getCostById(CostId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();

  req.query._id = object._id;
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter._id) {
    filters.push({ _id: new mongoose.Types.ObjectId(filter._id) })
  }

  const objectCost = await Cost.paginate(filters, options, req);
  return objectCost.results[0];

};


const deleteCostById = async (CostId) => {
  const object = await getCostById(CostId);
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
  createCost,
  queryCost,
  getCostById,
  updateCostById,
  deleteCostById
};
