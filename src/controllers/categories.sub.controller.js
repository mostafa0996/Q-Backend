
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categorySubService } = require('../services');
const i18next = require('i18next');
const mongoose = require("mongoose");
const { admin } = require('../config/contant');

const createCategory = catchAsync(async (req, res) => {
  delete req.body._id;
  const Category = await categorySubService.createCategory(req.body);

  res.status(httpStatus.CREATED).send(await getSubCategoryByIdWithCategory(Category._id, req));
});

const getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'app', 'keyword', 'category']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }
  if (!req.user || req.user.role !== admin) {
    filters.push({ active: 1 })
  }

  if (filter.category) {
    filters.push({ category: new mongoose.Types.ObjectId(filter.category) })
  }
  const result = await categorySubService.queryCategory(filters, options, req);
  res.send(result);
});


const getSubCategoryByIdWithCategory = async (id, req) => {
  var filters = [];
  filters.push({ _id: new mongoose.Types.ObjectId(id) })
  const result = await categorySubService.queryCategory(filters, [], req);
  return result.results[0];
};


const getCategory = catchAsync(async (req, res) => {
  const Category = await categorySubService.getCategoryById(req.params.id);
  if (!Category) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  res.send(await getSubCategoryByIdWithCategory(req.params.id, req));
});

const updateCategory = catchAsync(async (req, res) => {
  console.log(req.body)
  const Category = await categorySubService.updateCategoryById(req.params.id, req.body);
  res.send(await getSubCategoryByIdWithCategory(req.params.id, req));
});

const deleteCategory = catchAsync(async (req, res) => {
  const Category = await categorySubService.deleteCategoryById(req.params.id);
  res.send(Category);
});

module.exports = {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
