const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { advantageService } = require('../services');
const i18next = require('i18next');

const createAdvantage = catchAsync(async (req, res) => {
  delete req.body._id;
  const Advantage = await advantageService.createAdvantage(req.body);
  res.status(httpStatus.CREATED).send(Advantage);
});

const getAdvantages = catchAsync(async (req, res) => {


  const filter = pick(req.query, ['keyword', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ title: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }
  if (filter.type) {
    filters.push({ type: filter.type })
  }
  const result = await advantageService.queryAdvantage(filters, options, req, { scheme: 'Advantage', Nolanguage: true, type: filter.type });
  res.send(result);
});


const getAdvantage = catchAsync(async (req, res) => {
  const Advantage = await advantageService.getAdvantageById(req.params.id);
  if (!Advantage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  res.send(Advantage);
});

const updateAdvantage = catchAsync(async (req, res) => {
  const Advantage = await advantageService.updateAdvantageById(req.params.id, req.body);
  res.send(Advantage);
});

const deleteAdvantage = catchAsync(async (req, res) => {
  const Advantage = await advantageService.deleteAdvantageById(req.params.id);
  res.send(Advantage);
});

module.exports = {
  createAdvantage,
  getAdvantage,
  getAdvantages,
  updateAdvantage,
  deleteAdvantage,
};
