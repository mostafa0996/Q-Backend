const { Partner } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createPartner = async (Body) => {
  const object = await Partner.create(Body);
  return object;
};

const queryPartner = async (filter, options, req, Check) => {
  const object = await Partner.paginate(filter, options, req, Check);
  return object; s
};

const queryPartnerWorkShops = async (filter, options, req) => {
  const object = await Partner.workshops(filter, options, req);
  return object;
};


const getPartnerById = async (id) => {
  return Partner.findById(id);
};


const updatePartnerById = async (PartnerId, updateBody) => {
  const object = await getPartnerById(PartnerId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  return object;
};


const deletePartnerById = async (PartnerId) => {
  const object = await getPartnerById(PartnerId);
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
  createPartner,
  queryPartner,
  getPartnerById,
  updatePartnerById,
  deletePartnerById,
  queryPartnerWorkShops
};
