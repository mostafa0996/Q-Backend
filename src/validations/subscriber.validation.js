const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createSubscriber = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  })
};

const getSubscribers = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getSubscriber = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateSubscriber = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    email: Joi.string().required(),
    unsubscriber: Joi.number().integer(),
    _id: Joi.string().allow(null),
  })
};

const deleteSubscriber = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSubscriber,
  getSubscribers,
  getSubscriber,
  updateSubscriber,
  deleteSubscriber,
};
