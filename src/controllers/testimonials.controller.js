const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { testimonialssService } = require('../services');
const i18next = require('i18next');
const { admin } = require('../config/contant');

const createTestimonials = catchAsync(async (req, res) => {
  delete req.body._id;
  const Testimonials = await testimonialssService.createTestimonials(req.body);
  res.status(httpStatus.CREATED).send(Testimonials);
});

const getTestimonialss = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }

  const result = await testimonialssService.queryTestimonials(filters, options, req, { scheme: 'Cities' });
  res.send(result);
});


const getTestimonials = catchAsync(async (req, res) => {

  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);
  var filters = [];
  filters.push({ type: Number(req.params.id) })
  const result = await testimonialssService.queryTestimonials(filters, options, req);
  res.send(result.results[0]);
});

const updateTestimonials = catchAsync(async (req, res) => {
  const Testimonials = await testimonialssService.updateTestimonialsById(req.params.id, req.body);
  res.send(Testimonials);
});

const deleteTestimonials = catchAsync(async (req, res) => {
  const Testimonials = await testimonialssService.deleteTestimonialsById(req.params.id);
  res.send(Testimonials);
});

module.exports = {
  createTestimonials,
  getTestimonials,
  getTestimonialss,
  updateTestimonials,
  deleteTestimonials,
};
