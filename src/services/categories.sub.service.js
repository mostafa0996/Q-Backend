const { CategoryNews } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createCategory = async (Body) => {
  const category = await CategoryNews.create(Body);
  return category;
};

const queryCategory = async (filter, options, req) => {
  const category = await CategoryNews.paginate(filter, options, req);
  return category;
};




const getCategoryById = async (id) => {
  return CategoryNews.findById(id);
};


const updateCategoryById = async (CategoryId, updateBody) => {
  const category = await getCategoryById(CategoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};


const deleteCategoryById = async (CategoryId) => {
  const category = await getCategoryById(CategoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  await category.remove();
  return {
    code: httpStatus.OK,
    message: i18next.t('Success')
  };
};


module.exports = {
  createCategory,
  queryCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};
