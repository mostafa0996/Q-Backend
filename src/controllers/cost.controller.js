const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { costService } = require('../services');
const i18next = require('i18next');
const mongoose = require("mongoose");
const { admin, normal } = require('../config/contant');


const createCost = catchAsync(async (req, res) => {
  delete req.body._id;


  // CHECK IF ALREADY EXIST

  const filter = pick(req.body, ['from', 'to', 'category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);
  var filters = [];
  if (filter.from) {
    filters.push({ from: new mongoose.Types.ObjectId(filter.from) })
  }
  if (filter.to) {
    filters.push({ to: new mongoose.Types.ObjectId(filter.to) })
  }
  if (filter.category) {
    filters.push({ category: new mongoose.Types.ObjectId(filter.category) })
  }
  const result = await costService.queryCost(filters, options, req, { scheme: 'Cost' });


  console.log(result.results[0], filters, filter)
  if (!result.results[0]) {

    const Cost = await costService.createCost(req.body, req);
    res.status(httpStatus.CREATED).send(Cost);

  } else {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('UNABLE TO CREATE FROM,TO AND CATEGORY IS ALREADY LINKED TO ANOTEHR COST'));
  }

});

const getCosts = catchAsync(async (req, res) => {


  const filter = pick(req.query, ['from', 'to', 'category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];

  if (filter.from) {
    filters.push({ from: new mongoose.Types.ObjectId(filter.from) })
  }
  if (filter.to) {
    filters.push({ to: new mongoose.Types.ObjectId(filter.to) })
  }
  if (filter.category) {
    filters.push({ category: new mongoose.Types.ObjectId(filter.category) })
  }


  const result = await costService.queryCost(filters, options, req, { scheme: 'Cost' });
  if (!req.user || req.user.role === normal) {
    res.send(result.results[0] ? result.results[0] : {});
  } else {
    res.send(result);
  }

});


const getCost = catchAsync(async (req, res) => {
  const Cost = await costService.getCostById(req.params.id);
  if (!Cost) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  res.send(Cost);
});

const updateCost = catchAsync(async (req, res) => {
  const Cost = await costService.updateCostById(req.params.id, req.body, req);
  res.send(Cost);
});

const deleteCost = catchAsync(async (req, res) => {
  const Cost = await costService.deleteCostById(req.params.id);
  res.send(Cost);
});

module.exports = {
  createCost,
  getCost,
  getCosts,
  updateCost,
  deleteCost,
};
