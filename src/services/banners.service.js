const { Banner } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');

const createBanner = async (Body) => {
  const banner = await Banner.create(Body);
  return banner;
};

const queryBanner = async (filter, options, req) => {
  const banner = await Banner.paginate(filter, options, req);
  return banner;
};



const getBannerById = async (id) => {
  return Banner.findById(id);
};


const updateBannerById = async (BannerId, updateBody) => {
  const banner = await getBannerById(BannerId);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  Object.assign(banner, updateBody);
  await banner.save();
  return banner;
};


const deleteBannerById = async (BannerId) => {
  const banner = await getBannerById(BannerId);
  if (!banner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  await banner.remove();
  return {
    code: httpStatus.OK,
    message: i18next.t('Success')
  };
};


module.exports = {
  createBanner,
  queryBanner,
  getBannerById,
  updateBannerById,
  deleteBannerById
};
