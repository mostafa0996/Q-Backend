const httpStatus = require('http-status');
const i18next = require('i18next');
const { Shipments } = require('../models');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const mongoose = require("mongoose");
const { normal, driver } = require('../config/contant');


const createShipments = async (userBody, req) => {
  const object = await Shipments.create(userBody);
  req.query._id = object._id;
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter._id) {
    filters.push({ _id: new mongoose.Types.ObjectId(filter._id) })
  }

  const objectShipment = await Shipments.paginateuser(filters, options, req);
  return objectShipment.results[0];
};

const queryShipments = async (filter, options, req) => {

  if (!req.user || req.user.role === normal || req.user.role === driver) {
    const object = await Shipments.paginateuser(filter, options, req);
    return object;
  } else {
    const object = await Shipments.paginateadmin(filter, options, req);
    return object;
  }
};


const getShipmentsById = async (id, req) => {
  req.query._id = id;
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter._id) {
    filters.push({ _id: new mongoose.Types.ObjectId(filter._id) })
  }


  if (!req.user || req.user.role === normal) {
    const objectShipment = await Shipments.paginateuser(filters, options, req);
    return objectShipment.results[0];
  } else {
    const objectShipment = await Shipments.paginateadmin(filters, options, req);
    return objectShipment.results[0];
  }


};

const getShipmentsByIds = async (ids, req) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
    filters.push({ _id: {$in : ids} })


  if (!req.user || req.user.role === normal) {
    const objectShipment = await Shipments.paginateuser(filters, options, req);
    return objectShipment.results;
  } else {
    const objectShipment = await Shipments.paginateadmin(filters, options, req);
    return objectShipment.results;
  }


};



const getShipmentsByIdSimple = async (ShipmentsId) => {
  return (await Shipments.findById(ShipmentsId));
};



const updateShipmentsById = async (ShipmentsId, updateBody, req) => {
  const object = await getShipmentsByIdSimple(ShipmentsId, req);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();

  req.query._id = ShipmentsId;
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter._id) {
    filters.push({ _id: new mongoose.Types.ObjectId(filter._id) })
  }


  if (!req.user || req.user.role === normal || req.user.role === driver) {
    const objectShipment = await Shipments.paginateuser(filters, options, req);
    return objectShipment.results[0];
  } else {
    const objectShipment = await Shipments.paginateadmin(filters, options, req);
    return objectShipment.results[0];
  }


};

const deleteShipmentsById = async (ShipmentsId, req) => {
  const object = await getShipmentsByIdSimple(ShipmentsId, req);
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
  createShipments,
  queryShipments,
  getShipmentsById,
  updateShipmentsById,
  deleteShipmentsById,
  getShipmentsByIds
}
