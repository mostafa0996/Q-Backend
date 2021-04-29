const catchAsync = require('../utils/catchAsync');
const { bannersService, testimonialssService, homeContentService, countersService, partnersService } = require('../services');
const pick = require('../utils/pick');
const { User, Shipments } = require('../models');
const { company, ecommerce } = require('../config/contant');

const home = catchAsync(async (req, res) => {

  req.query.isPagination = false;
  var filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  var options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var banners = await bannersService.queryBanner([filter], options, req);
  res.send({ banners: banners });

});
const homeAdmin = catchAsync(async (req, res) => {



  var CompaniesCountActive = await User.count({ active: 1, role: company });
  var CompaniesCountInActive = await User.count({ active: 0, role: company });
  var Companies = await User.count({ role: company });


  var EcommercesCountActive = await User.count({ active: 1, role: ecommerce });
  var EcommercesCountInActive = await User.count({ active: 0, role: ecommerce });
  var Ecommerces = await User.count({ role: ecommerce });



  var ShipmentsPending = await Shipments.count({ status: 0 });
  var ShipmentsDispatched = await Shipments.count({ status: 1 });
  var ShipmentsOnThyWay = await Shipments.count({ status: 2 });
  var ShipmentsCompleted = await Shipments.count({ status: 3 });
  var ShipmentsCanceled = await Shipments.count({ status: 4 });

  var ShipmentsAssigned = await Shipments.count({ assignedStatus: 1 });
  var ShipmentsUnAssigned = await Shipments.count({ assignedStatus: 0 });

  res.send({
    CompaniesCountActive: CompaniesCountActive,
    CompaniesCountInActive: CompaniesCountInActive,
    Companies: Companies,


    EcommercesCountActive: EcommercesCountActive,
    EcommercesCountInActive: EcommercesCountInActive,
    Ecommerces: Ecommerces,


    ShipmentsPending: ShipmentsPending,
    ShipmentsDispatched: ShipmentsDispatched,
    ShipmentsOnThyWay: ShipmentsOnThyWay,
    ShipmentsCompleted: ShipmentsCompleted,
    ShipmentsCanceled: ShipmentsCanceled,


    ShipmentsAssigned: ShipmentsAssigned,
    ShipmentsUnAssigned: ShipmentsUnAssigned,

  });

});


const websiteHome = catchAsync(async (req, res) => {

  req.query.isPagination = false;
  var filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  var options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);


  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }




  const counters = await countersService.queryCounter(filters, options, req);
  const partners = await partnersService.queryPartner(filters, options, req);
  const testimonials = await testimonialssService.queryTestimonials(filters, options, req);
  const home_contents = await homeContentService.queryhomeContent(filters, options, req);




  res.send({ counters: counters, partners: partners, testimonials: testimonials, home_contents: home_contents });

});

module.exports = {
  home,
  homeAdmin,
  websiteHome
};
