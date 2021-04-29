const { Subscriber } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createSubscriber = async (Body) => {
  const object = await (await Subscriber.create(Body));
  return object;
};

const querySubscriber = async (filter, options, req, Check) => {
  const object = await Subscriber.paginate(filter, options, req, Check);
  return object;
};



const getSubscriberById = async (SubscriberId) => {
  return (await Subscriber.findById(SubscriberId));
};


const updateSubscriberById = async (SubscriberId, updateBody) => {
  var object = await getSubscriberById(SubscriberId);
  console.log(object);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  object = await getSubscriberById(SubscriberId);
  return object;
};


const deleteSubscriberById = async (SubscriberId) => {
  const object = await getSubscriberById(SubscriberId);
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
  createSubscriber,
  querySubscriber,
  getSubscriberById,
  updateSubscriberById,
  deleteSubscriberById
};
