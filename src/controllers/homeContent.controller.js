const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { homeContentService } = require('../services');

const createhomeContent = catchAsync(async (req, res) => {
  delete req.body._id;
  const homeContent = await homeContentService.createhomeContent(req.body);
  res.status(httpStatus.CREATED).send(homeContent);
});

const gethomeContents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }

  const result = await homeContentService.queryhomeContent(filters, options, req, { scheme: 'Cities' });
  res.send(result);
});


const gethomeContent = catchAsync(async (req, res) => {

  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);
  var filters = [];
  filters.push({ type: Number(req.params.id) })
  const result = await homeContentService.queryhomeContent(filters, options, req);
  res.send(result.results[0]);
});

const updatehomeContent = catchAsync(async (req, res) => {
  const homeContent = await homeContentService.updatehomeContentById(req.params.id, req.body);
  res.send(homeContent);
});

const deletehomeContent = catchAsync(async (req, res) => {
  const homeContent = await homeContentService.deletehomeContentById(req.params.id);
  res.send(homeContent);
});

module.exports = {
  createhomeContent,
  gethomeContent,
  gethomeContents,
  updatehomeContent,
  deletehomeContent,
};
