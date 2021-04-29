const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createTestimonialss = {
  body: Joi.object().keys({
    description_ar: Joi.string().required(),
    description_en: Joi.string().required(),
    image: Joi.string().required(),
  })
};

const getTestimonialss = {
  query: Joi.object().keys({
    isPagination: Joi.boolean().default(true),
    keyword: Joi.string(),
    status: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


const getTestimonials = {
  params: Joi.object().keys({
  }),
};

const updateTestimonialss = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    description_ar: Joi.string().required(),
    description_en: Joi.string().required(),
    image: Joi.string().required(),
  })
};

const deleteTestimonialss = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createTestimonialss,
  getTestimonialss,
  getTestimonials,
  updateTestimonialss,
  deleteTestimonialss,
};
