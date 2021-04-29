const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createPartners = {
  body: Joi.object().keys({
    image: Joi.string().required(),
  })
};

const getPartners = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getPartner = {
  params: Joi.object().keys({
  }),
};

const updatePartners = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    image: Joi.string().required(),
  })
};

const deletePartners = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPartners,
  getPartners,
  getPartner,
  updatePartners,
  deletePartners,
};
