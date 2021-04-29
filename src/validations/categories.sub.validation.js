
const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createCategories = {
  body: Joi.object().keys({
    icon: Joi.string().required(),
    active: Joi.number().required(),
    other: Joi.number().default(0),
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    category: Joi.string().required().custom(objectId),
    _id: Joi.string().allow(null),
  })
};

const getCategories = {
  query: Joi.object().keys({
    keyword: Joi.string(),
    isPagination: Joi.boolean().default(true),
    status: Joi.string(),
    sortBy: Joi.string(),
    category: Joi.string(),
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
    other: Joi.number().default(0),
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    category: Joi.string().custom(objectId),
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
