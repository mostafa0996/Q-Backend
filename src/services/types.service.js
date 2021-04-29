const { Type } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createtype = async (Body) => {
  const type = await (await Type.create(Body));
  return type;
};

const querytype = async (filter, options, req, check) => {
  const type = await Type.paginate(filter, options, req, check);
  return type;
};



const gettypeById = async (id) => {
  return Type.findById(id);
};


const updatetypeById = async (typeId, updateBody) => {
  console.log(typeId)
  const type = await gettypeById(typeId);
  if (!type) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(type, updateBody);
  await type.save();
  return type;
};


const deletetypeById = async (typeId) => {
  const type = await gettypeById(typeId);
  if (!type) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  await type.remove();
  return {
    code: httpStatus.OK,
    message: i18next.t('Success')
  };
};


module.exports = {
  createtype,
  querytype,
  gettypeById,
  updatetypeById,
  deletetypeById
};
