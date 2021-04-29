const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createhomeContents = {
  body: Joi.object().keys({
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),

    description_ar: Joi.string().required(),
    description_en: Joi.string().required(),

    type: Joi.number().required(),
  })
};

const gethomeContents = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const gethomeContent = {
  params: Joi.object().keys({
  }),
};

const updatehomeContents = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title_ar: Joi.string().required(),
    title_en: Joi.string().required(),

    description_ar: Joi.string().required(),
    description_en: Joi.string().required(),

    type: Joi.number().required(),
  })
};

const deletehomeContents = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createhomeContents,
  gethomeContents,
  gethomeContent,
  updatehomeContents,
  deletehomeContents,
};
