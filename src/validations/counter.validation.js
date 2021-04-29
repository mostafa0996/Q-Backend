const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createCounters = {
  body: Joi.object().keys({
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    value: Joi.string().required()
  })
};

const getCounters = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getCounter = {
  params: Joi.object().keys({
  }),
};

const updateCounters = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    value: Joi.string().required()
  })
};

const deleteCounters = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCounters,
  getCounters,
  getCounter,
  updateCounters,
  deleteCounters,
};
