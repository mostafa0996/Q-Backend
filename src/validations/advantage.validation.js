const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createAdvantage = {
  body: Joi.object().keys({
    title_en: Joi.string().required(),
    title_ar: Joi.string().required(),
    description_en: Joi.string().required(),
    description_ar: Joi.string().required(),
    image: Joi.string().required(),
    active: Joi.number().integer().default(1),
    _id: Joi.string().allow(null),

  })
};

const getAdvantages = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getAdvantage = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateAdvantage = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title_en: Joi.string().required(),
    title_ar: Joi.string().required(),
    description_en: Joi.string().required(),
    description_ar: Joi.string().required(),
    image: Joi.string().required(),
    active: Joi.number().integer(),
    _id: Joi.string().allow(null),
  })
};

const deleteAdvantage = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAdvantage,
  getAdvantages,
  getAdvantage,
  updateAdvantage,
  deleteAdvantage,
};
