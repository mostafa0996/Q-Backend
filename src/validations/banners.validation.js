const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createBanners = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    active: Joi.number().required(),
    _id: Joi.string().allow(null),
  })
};

const getBanners = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getBanner = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateBanners = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    image: Joi.string().required(),
    active: Joi.number().required(),
    _id: Joi.string().allow(null),
  })
};

const deleteBanners = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBanners,
  getBanners,
  getBanner,
  updateBanners,
  deleteBanners,
};
