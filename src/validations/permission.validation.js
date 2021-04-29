const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');


const createPermissions = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    type: Joi.string().required(),
    icon: Joi.string().required(),
    url: Joi.string().required(),
    id: Joi.string().required(),
  })
};

const getPermissions = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getPermission = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updatePermissions = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    type: Joi.string().required(),
    icon: Joi.string().required(),
    url: Joi.string().required(),
    id: Joi.string().required(),
  })
};

const deletePermissions = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPermissions,
  getPermissions,
  getPermission,
  updatePermissions,
  deletePermissions,
};
