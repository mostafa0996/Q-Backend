const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const queryContacts = {
  body: Joi.object().keys({
    keyword: Joi.string(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const createContact = {
  body: Joi.object().keys({
    type: Joi.number().allow(1, 2, 3).required(),

    numberofvehicles: Joi.when('type', { is: 1, then: Joi.number().required(), otherwise: Joi.number() }),
    ordersperday: Joi.when('type', { is: 2, then: Joi.number().required(), otherwise: Joi.number() }),


    companyname: Joi.when('type', { is: 3, then: Joi.string().allow(''), otherwise: Joi.string().required() }),
    city: Joi.when('type', { is: 3, then: Joi.string(), otherwise: Joi.string().custom(objectId).required() }),

    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().allow(''),
  }),
};


const updateContact = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    type: Joi.number().allow(1, 2, 3).required(),

    numberofvehicles: Joi.when('type', { is: 1, then: Joi.number().required(), otherwise: Joi.number() }),
    ordersperday: Joi.when('type', { is: 2, then: Joi.number().required(), otherwise: Joi.number() }),


    companyname: Joi.when('type', { is: 3, then: Joi.string().allow(''), otherwise: Joi.string().required() }),
    city: Joi.when('type', { is: 3, then: Joi.string(), otherwise: Joi.string().custom(objectId).required() }),

    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().allow(''),
  })
};



const getContact = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const deleteContact = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};


module.exports = {
  queryContacts,
  getContact,
  deleteContact,
  updateContact,
  createContact
};
