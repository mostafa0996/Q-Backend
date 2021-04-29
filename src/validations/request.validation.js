const Joi = require('@hapi/joi');
const { companyOrIndividual } = require('../config/roles');
const { objectId } = require('./custom.validation');

const queryRequests = {
  body: Joi.object().keys({
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const createRequest = {
  body: Joi.object().keys({
    type: Joi.number().allow(companyOrIndividual[0], companyOrIndividual[1]).required(),
    details: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().allow(''),
  }),
};


const updateRequest = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    type: Joi.number().allow(companyOrIndividual[0], companyOrIndividual[1]).required(),
    details: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().allow(''),
  })
};



const getRequest = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const deleteRequest = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};


module.exports = {
  queryRequests,
  getRequest,
  deleteRequest,
  updateRequest,
  createRequest
};
