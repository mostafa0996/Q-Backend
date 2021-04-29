const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createContents = {
  body: Joi.object().keys({
    content_ar: Joi.string().required(),
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    content_en: Joi.string().required(),
    type: Joi.number().required(),
  })
};

const getContents = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getContent = {
  params: Joi.object().keys({
  }),
};

const updateContents = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    content_ar: Joi.string().required(),
    content_en: Joi.string().required(),
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),
    type: Joi.number().required(),
  })
};

const deleteContents = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createContents,
  getContents,
  getContent,
  updateContents,
  deleteContents,
};
