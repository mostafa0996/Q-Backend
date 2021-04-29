const { Testimonials } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createTestimonials = async (Body) => {
  const object = await Testimonials.create(Body);
  return object;
};

const queryTestimonials = async (filter, options, req, Check) => {
  const object = await Testimonials.paginate(filter, options, req, Check);
  return object; s
};

const queryTestimonialsWorkShops = async (filter, options, req) => {
  const object = await Testimonials.workshops(filter, options, req);
  return object;
};


const getTestimonialsById = async (id) => {
  return Testimonials.findById(id);
};


const updateTestimonialsById = async (TestimonialsId, updateBody) => {
  const object = await getTestimonialsById(TestimonialsId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();
  return object;
};


const deleteTestimonialsById = async (TestimonialsId) => {
  const object = await getTestimonialsById(TestimonialsId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  await object.remove();
  return {
    code: httpStatus.OK,
    message: i18next.t('Success')
  };
};


module.exports = {
  createTestimonials,
  queryTestimonials,
  getTestimonialsById,
  updateTestimonialsById,
  deleteTestimonialsById,
  queryTestimonialsWorkShops
};
