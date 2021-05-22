const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { requestService, infoService } = require('../services');
const i18next = require('i18next');
const ApiError = require('../utils/ApiError');
const mongoose = require("mongoose");
const { response } = require('../config/contant');



const createRequest = catchAsync(async (req, res) => {
  delete req.body._id;
  const object = await requestService.createRequest(req.body);
  res.send(response(httpStatus.OK, i18next.t('Thanks for contacting us we will be in touch with you shortly.'), object));
  infoService.sendEmail('enquiry@deliverq.com', 'DeliverQ Request', '<h2>Hi DeliverQ!</h2> <p style="font-size: 1.5em;">You have new Query request from ' + req.body.name + ' .</p>    <p style="font-size: 1.5em;"><strong>Email: </strong> ' + req.body.email + '</p>   <p style="font-size: 1.5em;"><strong>Phone: </strong> ' + req.body.phone + '</p>  <p style="font-size: 1.5em;"><strong>Type: </strong> ' + req.body.type + '</p> <p style="font-size: 1.5em;">Thanks ,</p>')

});


const getRequests = catchAsync(async (req, res) => {

  const filter = pick(req.query, ['status', 'keyword', 'requestTo', 'requestby', 'type_hour', 'duration', 'post_story', 'ad_type', 'type', 'startDate', 'endDate', 'tag']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ subject: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }
  if (filter.status) {
    filters.push({ status: filter.status })
  }
  if (filter.requestTo) {
    filters.push({ requestTo: new mongoose.Types.ObjectId(filter.requestTo) })
  }
  if (filter.requestby) {
    filters.push({ requestby: new mongoose.Types.ObjectId(filter.requestby) })
  }
  if (filter.type_hour) {
    filters.push({ type_hour: filter.type_hour })
  }
  if (filter.duration) {
    filters.push({ duration: new mongoose.Types.ObjectId(filter.duration) })
  }
  if (filter.post_story) {
    filters.push({ post_story: filter.post_story })
  }
  if (filter.ad_type) {
    filters.push({ ad_type: filter.ad_type })
  }
  if (filter.type) {
    filters.push({ type: filter.type })
  }

  if (
    filter.endDate &&
    filter.startDate &&
    new Date(filter.startDate).toString() !== 'Invalid Date' &&
    new Date(filter.endDate).toString() !== 'Invalid Date'
  ) {
    filters.push({
      createdAt: {
        $gte: new Date(filter.startDate),
        $lte: new Date(
          new Date(filter.endDate).setDate(
            new Date(filter.endDate).getDate() + 1
          )
        ),
      },
    });
  }

  if (filter.tag && filter.tag!= 'undefined') {
    filters.push({ name: filter.tag });
  }


  const result = await requestService.queryRequests(filters, options, req);
  res.send(result);
});


const getRequest = catchAsync(async (req, res) => {
  const Request = await requestService.getRequestById(req.params.id);
  if (!Request) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  res.send(Request);
});

const updateRequest = catchAsync(async (req, res) => {
  const Request = await requestService.updateRequestById(req.params.id, req.body, req);
  res.send(Request);
});

const deleteRequest = catchAsync(async (req, res) => {
  const Request = await requestService.deleteRequestById(req.params.id);
  res.send(Request);
});



module.exports = {
  createRequest,
  getRequests,
  deleteRequest,
  updateRequest,
  getRequest
};
