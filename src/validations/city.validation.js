const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');


const createCitys = {
  body: Joi.object().keys({
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    active: Joi.number().default(1),
    _id: Joi.string().allow(null),
  })
};

const getCitys = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getCity = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateCitys = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    active: Joi.number(),
    _id: Joi.string().allow(null),
  })
};

const deleteCitys = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCitys,
  getCitys,
  getCity,
  updateCitys,
  deleteCitys,
};
