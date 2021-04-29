const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');


const getNotifications = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};



const deleteNotifications = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getNotifications,
  deleteNotifications,
};
