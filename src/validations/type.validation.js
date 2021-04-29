const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createTypes = {
  body: Joi.object().keys({
    duration: Joi.string().required(),
    active: Joi.number().required().default(1),
    price: Joi.number().required(),
    image: Joi.string().required(),
    _id: Joi.string().allow(null),

    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
  })
};

const getTypes = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getType = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateTypes = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    duration: Joi.string().required(),
    active: Joi.number().required(),
    price: Joi.number().required(),
    image: Joi.string().required(),
    _id: Joi.string().allow(null),
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
  })
};

const deleteTypes = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTypes,
  getTypes,
  getType,
  updateTypes,
  deleteTypes,
};
