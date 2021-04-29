const { Address } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');
const pick = require('../utils/pick');
const mongoose = require("mongoose");

const createAddress = async (Body, req) => {
  const object = await Address.create(Body);
  req.query._id = object._id;
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter._id) {
    filters.push({ _id: new mongoose.Types.ObjectId(filter._id) })
  }

  const objectCost = await Address.paginate(filters, options, req, { scheme: 'Address' });
  return objectCost.results[0];
};

const queryAddress = async (filter, options, req, Check) => {
  const object = await Address.paginate(filter, options, req, Check);
  return object;
}


const getAddressById = async (id) => {
  return Address.findById(id);
};


const updateAddressById = async (AddressId, updateBody, req) => {
  const object = await getAddressById(AddressId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();


  req.query._id = object._id;
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter._id) {
    filters.push({ _id: new mongoose.Types.ObjectId(filter._id) })
  }

  const objectCost = await Address.paginate(filters, options, req, { scheme: 'Address' });
  return objectCost.results[0];
};


const deleteAddressById = async (AddressId) => {
  const object = await getAddressById(AddressId);
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
  createAddress,
  queryAddress,
  getAddressById,
  updateAddressById,
  deleteAddressById
};
