const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { contentsService } = require('../services');
const i18next = require('i18next');
const { admin } = require('../config/contant');

const createContent = catchAsync(async (req, res) => {
  delete req.body._id;
  const Content = await contentsService.createContent(req.body);
  res.status(httpStatus.CREATED).send(Content);
});

const getContents = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }

  const result = await contentsService.queryContent(filters, options, req);
  res.send(result);
});


const getContent = catchAsync(async (req, res) => {

  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);
  var filters = [];
  filters.push({ type: Number(req.params.id) })
  const result = await contentsService.queryContent(filters, options, req);
  res.send(result.results[0]);
});

const updateContent = catchAsync(async (req, res) => {
  const Content = await contentsService.updateContentById(req.params.id, req.body);
  res.send(Content);
});

const deleteContent = catchAsync(async (req, res) => {
  const Content = await contentsService.deleteContentById(req.params.id);
  res.send(Content);
});

module.exports = {
  createContent,
  getContent,
  getContents,
  updateContent,
  deleteContent,
};
