const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { cityService } = require('../services');
const i18next = require('i18next');
const { normal } = require('../config/contant');

const createCity = catchAsync(async (req, res) => {
  delete req.body._id;
  const City = await cityService.createCity(req.body);
  res.status(httpStatus.CREATED).send(City);
});

const getCitys = catchAsync(async (req, res) => {


  const filter = pick(req.query, ['keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ title: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }

  if (!!!req.user || req.user.role === normal) {
    filters.push({ active: 1 })
  }

  const result = await cityService.queryCity(filters, options, req, { scheme: 'Cities' });
  res.send(result);
});


const getCity = catchAsync(async (req, res) => {
  const City = await cityService.getCityById(req.params.id);
  if (!City) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  res.send(City);
});

const updateCity = catchAsync(async (req, res) => {
  const City = await cityService.updateCityById(req.params.id, req.body);
  res.send(City);
});

const deleteCity = catchAsync(async (req, res) => {
  const City = await cityService.deleteCityById(req.params.id);
  res.send(City);
});

module.exports = {
  createCity,
  getCity,
  getCitys,
  updateCity,
  deleteCity,
};
