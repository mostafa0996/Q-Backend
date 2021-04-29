const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bannersService } = require('../services');
const i18next = require('i18next');
const { admin } = require('../config/contant');

const createBanner = catchAsync(async (req, res) => {
  delete req.body._id;
  const Banner = await bannersService.createBanner(req.body);
  res.status(httpStatus.CREATED).send(Banner);
});

const getBanners = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }
  if (!req.user || req.user.role !== admin) {
    filters.push({ active: 1 })
  }
  const result = await bannersService.queryBanner(filters, options, req);
  res.send(result);
});


const getBanner = catchAsync(async (req, res) => {
  const Banner = await bannersService.getBannerById(req.params.id);
  if (!Banner) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  res.send(Banner);
});

const updateBanner = catchAsync(async (req, res) => {
  console.log(req.body)
  const Banner = await bannersService.updateBannerById(req.params.id, req.body);
  res.send(Banner);
});

const deleteBanner = catchAsync(async (req, res) => {
  const Banner = await bannersService.deleteBannerById(req.params.id);
  res.send(Banner);
});

module.exports = {
  createBanner,
  getBanner,
  getBanners,
  updateBanner,
  deleteBanner,
};
