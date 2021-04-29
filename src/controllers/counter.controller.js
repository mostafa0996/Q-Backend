const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { countersService } = require('../services');
const i18next = require('i18next');
const { admin } = require('../config/contant');

const createCounter = catchAsync(async (req, res) => {
  delete req.body._id;
  const Counter = await countersService.createCounter(req.body);
  res.status(httpStatus.CREATED).send(Counter);
});

const getCounters = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }

  const result = await countersService.queryCounter(filters, options, req);
  res.send(result);
});


const getCounter = catchAsync(async (req, res) => {

  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);
  var filters = [];
  filters.push({ type: Number(req.params.id) })
  const result = await countersService.queryCounter(filters, options, req);
  res.send(result.results[0]);
});

const updateCounter = catchAsync(async (req, res) => {
  const Counter = await countersService.updateCounterById(req.params.id, req.body);
  res.send(Counter);
});

const deleteCounter = catchAsync(async (req, res) => {
  const Counter = await countersService.deleteCounterById(req.params.id);
  res.send(Counter);
});

module.exports = {
  createCounter,
  getCounter,
  getCounters,
  updateCounter,
  deleteCounter,
};
