const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');


const createCost = {
  body: Joi.object().keys({
    from: Joi.string().required(),
    to: Joi.string().required(),
    category: Joi.string().required(),
    cost: Joi.number().required(),
  })
};

const getCosts = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    sortBy: Joi.string(),
    from: Joi.string(),
    to: Joi.string(),
    category: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getCost = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateCost = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    from: Joi.string().required(),
    to: Joi.string().required(),
    category: Joi.string().required(),
    cost: Joi.number().required(),
  })
};

const deleteCost = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCost,
  getCosts,
  getCost,
  updateCost,
  deleteCost,
};
