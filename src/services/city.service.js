const { City } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createCity = async (Body) => {
  console.log('Body', Body)
  const object = await City.create(Body);
  return object;
};

const queryCity = async (filter, options, req, Check) => {
  const object = await City.paginate(filter, options, req, Check);
  return object;
};



const getCityById = async (CityId) => {
  return City.findById(CityId);
};


const updateCityById = async (CityId, updateBody) => {
  const object = await getCityById(CityId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  return object;
};


const deleteCityById = async (CityId) => {
  const object = await getCityById(CityId);
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
  createCity,
  queryCity,
  getCityById,
  updateCityById,
  deleteCityById
};
