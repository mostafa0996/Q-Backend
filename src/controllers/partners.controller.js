const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { partnersService } = require('../services');
const i18next = require('i18next');
const { admin } = require('../config/contant');

const createPartner = catchAsync(async (req, res) => {
  delete req.body._id;
  const Partner = await partnersService.createPartner(req.body);
  res.status(httpStatus.CREATED).send(Partner);
});

const getPartners = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }

  const result = await partnersService.queryPartner(filters, options, req, { scheme: 'Partner' });
  res.send(result);
});


const getPartner = catchAsync(async (req, res) => {

  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);
  var filters = [];
  filters.push({ type: Number(req.params.id) })
  const result = await partnersService.queryPartner(filters, options, req);
  res.send(result.results[0]);
});

const updatePartner = catchAsync(async (req, res) => {
  const Partner = await partnersService.updatePartnerById(req.params.id, req.body);
  res.send(Partner);
});

const deletePartner = catchAsync(async (req, res) => {
  const Partner = await partnersService.deletePartnerById(req.params.id);
  res.send(Partner);
});

module.exports = {
  createPartner,
  getPartner,
  getPartners,
  updatePartner,
  deletePartner,
};
