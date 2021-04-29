const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createCategories = {
  body: Joi.object().keys({
    icon: Joi.string().required(),
    active: Joi.number().required(),
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    weight: Joi.number().required(),
    price: Joi.number().default(0),
    _id: Joi.string().allow(null),
  })
};

const getCategories = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getCategory = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateCategories = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    icon: Joi.string().required(),
    active: Joi.number().required(),
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    weight: Joi.number().required(),
    price: Joi.number().default(0),
    _id: Joi.string().allow(null),
  })
};

const deleteCategories = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCategories,
  getCategories,
  getCategory,
  updateCategories,
  deleteCategories,
};
