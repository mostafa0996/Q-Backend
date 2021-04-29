const { homeContent } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createhomeContent = async (Body) => {
  const object = await homeContent.create(Body);
  return object;
};

const queryhomeContent = async (filter, options, req, Check) => {
  const object = await homeContent.paginate(filter, options, req, Check);
  return object; s
};

const queryhomeContentWorkShops = async (filter, options, req) => {
  const object = await homeContent.workshops(filter, options, req);
  return object;
};


const gethomeContentById = async (id) => {
  return homeContent.findById(id);
};


const updatehomeContentById = async (homeContentId, updateBody) => {
  const object = await gethomeContentById(homeContentId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  return object;
};


const deletehomeContentById = async (homeContentId) => {
  const object = await gethomeContentById(homeContentId);
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
  createhomeContent,
  queryhomeContent,
  gethomeContentById,
  updatehomeContentById,
  deletehomeContentById,
  queryhomeContentWorkShops
};
