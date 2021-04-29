const httpStatus = require('http-status');
const i18next = require('i18next');
const { Request } = require('../models');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const mongoose = require("mongoose");


const createRequest = async (userBody) => {
  const request = await Request.create(userBody);
  return request;
};

const queryRequests = async (filter, options, req) => {
  const requests = await Request.paginate(filter, options, req);
  return requests;
};



const getRequestById = async (id) => {
  return (await Request.findById(id));
};

const updateRequestById = async (requestId, updateBody, req) => {
  console.log(requestId)
  const object = await getRequestById(requestId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();

  req.query._id = requestId;
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter._id) {
    filters.push({ _id: new mongoose.Types.ObjectId(filter._id) })
  }

  const requests = await Request.paginate(filters, options, req);
  return requests.results[0];
};

const deleteRequestById = async (requestId) => {
  const object = await getRequestById(requestId);
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
  createRequest,
  queryRequests,
  getRequestById,
  updateRequestById,
  deleteRequestById
}
