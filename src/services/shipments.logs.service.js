const httpStatus = require('http-status');
const i18next = require('i18next');
const { ShipmentsLogs } = require('../models');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const mongoose = require("mongoose");
const { normal } = require('../config/contant');


const createShipmentsLog = async (userBody, req) => {
  const object = await ShipmentsLogs.create(userBody);
  return object;
};

const queryShipments = async (filter, options, req) => {

  if (!req.user || req.user.role === normal) {
    const object = await ShipmentsLogs.paginateuser(filter, options, req);
    return object;
  } else {
    const object = await ShipmentsLogs.paginate(filter, options, req);
    return object;
  }
};


const getShipmentsById = async (id) => {
  return (await ShipmentsLogs.findById(id));
};



const updateShipmentsById = async (ShipmentsId, updateBody, req) => {
  console.log(ShipmentsId)
  const object = await getShipmentsById(ShipmentsId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  return object;
};

const deleteShipmentsById = async (ShipmentsId) => {
  const object = await getShipmentsById(ShipmentsId);
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
  createShipmentsLog,
  queryShipments,
  getShipmentsById,
  updateShipmentsById,
  deleteShipmentsById,
}
