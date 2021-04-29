const { Counter } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createCounter = async (Body) => {
  const object = await Counter.create(Body);
  return object;
};

const queryCounter = async (filter, options, req) => {
  const object = await Counter.paginate(filter, options, req);
  return object;
};

const queryCounterWorkShops = async (filter, options, req) => {
  const object = await Counter.workshops(filter, options, req);
  return object;
};


const getCounterById = async (id) => {
  return Counter.findById(id);
};


const updateCounterById = async (CounterId, updateBody) => {
  const object = await getCounterById(CounterId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  return object;
};


const deleteCounterById = async (CounterId) => {
  const object = await getCounterById(CounterId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  await object.remove();
  return {
    code: httpStatus.OK,
    message: i18next.t('Success')
  };
};


module.exports = {
  createCounter,
  queryCounter,
  getCounterById,
  updateCounterById,
  deleteCounterById,
  queryCounterWorkShops
};
