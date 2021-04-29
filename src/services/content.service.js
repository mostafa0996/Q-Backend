const { Content } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createContent = async (Body) => {
  const object = await Content.create(Body);
  return object;
};

const queryContent = async (filter, options, req) => {
  const object = await Content.paginate(filter, options, req);
  return object;s
};

const queryContentWorkShops = async (filter, options, req) => {
  const object = await Content.workshops(filter, options, req);
  return object;
};


const getContentById = async (id) => {
  return Content.findById(id);
};


const updateContentById = async (ContentId, updateBody) => {
  const object = await getContentById(ContentId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  return object;
};


const deleteContentById = async (ContentId) => {
  const object = await getContentById(ContentId);
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
  createContent,
  queryContent,
  getContentById,
  updateContentById,
  deleteContentById,
  queryContentWorkShops
};
