const { Advantage } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createAdvantage = async (Body) => {
  const object = await (await Advantage.create(Body));
  return object;
};

const queryAdvantage = async (filter, options, req, Check) => {
  const object = await Advantage.paginate(filter, options, req, Check);
  return object;
};



const getAdvantageById = async (AdvantageId) => {
  return (await Advantage.findById(AdvantageId));
};


const updateAdvantageById = async (AdvantageId, updateBody) => {
  var object = await getAdvantageById(AdvantageId);
  console.log(object);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  object = await getAdvantageById(AdvantageId);
  return object;
};


const deleteAdvantageById = async (AdvantageId) => {
  const object = await getAdvantageById(AdvantageId);
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
  createAdvantage,
  queryAdvantage,
  getAdvantageById,
  updateAdvantageById,
  deleteAdvantageById
};
