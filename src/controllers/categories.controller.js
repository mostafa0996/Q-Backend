const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');
const i18next = require('i18next');
const { admin } = require('../config/contant');

const createCategory = catchAsync(async (req, res) => {
  delete req.body._id;
  const Category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(Category);
});

const getCategories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }
  if (!req.user || req.user.role !== admin) {
    filters.push({ active: 1 })
  }
  const result = await categoryService.queryCategory(filters, options, req);


  for (let k in result.results) {
    // sort by other sub category
    result.results[k].SubCategories.sort((a, b) => {
      if (a.other < b.other) return -1;
      if (a.other > b.other) return 1;
      return 0;
    });

  }


  res.send(result);
});


const getCategory = catchAsync(async (req, res) => {
  const Category = await categoryService.getCategoryById(req.params.id);
  if (!Category) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  res.send(Category);
});

const updateCategory = catchAsync(async (req, res) => {
  const Category = await categoryService.updateCategoryById(req.params.id, req.body);
  res.send(Category);
});

const deleteCategory = catchAsync(async (req, res) => {
  const Category = await categoryService.deleteCategoryById(req.params.id);
  res.send(Category);
});

module.exports = {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
