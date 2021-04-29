const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { addressService } = require('../services');
const i18next = require('i18next');
const mongoose = require("mongoose");
const { response } = require('../config/contant');

const createAddress = catchAsync(async (req, res) => {
  req.body.user = req.user.id;
  const Address = await addressService.createAddress(req.body, req);
  res.send(response(httpStatus.OK, i18next.t('Address has been successfully craeted'), Address));
  res.status(httpStatus.CREATED).send(Address);
});

const getAllAddresses = catchAsync(async (req, res) => {


  const filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }
  if (req.user) {
    filters.push({ user: new mongoose.Types.ObjectId(req.user.id) })
  }
  console.log(filters)
  const result = await addressService.queryAddress(filters, options, req, { scheme: 'Address' });
  res.send(result);
});


const getAddress = catchAsync(async (req, res) => {
  const Address = await addressService.getAddressById(req.params.id);
  if (!Address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  res.send(Address);
});

const updateAddress = catchAsync(async (req, res) => {
  const Address = await addressService.updateAddressById(req.params.id, req.body, req);
  res.send(response(httpStatus.OK, i18next.t('Address has been successfully updated'), Address));
});

const deleteAddress = catchAsync(async (req, res) => {
  await addressService.deleteAddressById(req.params.id);
  res.send(response(httpStatus.OK, i18next.t('Address has been successfully deleted'), null));

});

module.exports = {
  createAddress,
  getAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
};
