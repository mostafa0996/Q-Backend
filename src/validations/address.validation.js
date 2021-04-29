const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createAddress = {
  body: Joi.object().keys({
    city: Joi.string().required(),
    area: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.number().required(),




    lat: Joi.string().required(),
    lng: Joi.string().required(),
    locationText: Joi.string().required(),


    floor: Joi.when('type', { is: 1, then: Joi.string().allow(''), otherwise: Joi.string().required() }),
    apartment: Joi.when('type', { is: 1, then: Joi.string().allow(''), otherwise: Joi.string().required() }),

    additional: Joi.string().allow('').default(''),
    street: Joi.string().default('').allow(''),
    building: Joi.string().required(),
    phone: Joi.string().required(),
  })
};

const getAddress = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getAddres = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateAddress = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    city: Joi.string().required(),
    area: Joi.string().required(),
    type: Joi.number().required(),
    name: Joi.string().required(),

    lat: Joi.string().required(),
    lng: Joi.string().required(),
    locationText: Joi.string().required(),



    floor: Joi.when('type', { is: 1, then: Joi.string().allow(''), otherwise: Joi.string().required() }),
    apartment: Joi.when('type', { is: 1, then: Joi.string().allow(''), otherwise: Joi.string().required() }),

    additional: Joi.string().allow('').default(''),
    street: Joi.string().default('').allow(''),
    building: Joi.string().required(),
    phone: Joi.string().required(),
    _id: Joi.string().allow(null),
  })
};

const deleteAddress = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAddress,
  getAddress,
  getAddres,
  updateAddress,
  deleteAddress,
};
