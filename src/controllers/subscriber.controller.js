const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subscriberService } = require('../services');
const i18next = require('i18next');

const createSubscriber = catchAsync(async (req, res) => {
  delete req.body._id;
  const Subscriber = await subscriberService.createSubscriber(req.body);
  res.status(httpStatus.CREATED).send(Subscriber);
});

const getSubscribers = catchAsync(async (req, res) => {


  const filter = pick(req.query, ['keyword', 'type', 'startDate', 'endDate', 'tag']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ title: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
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

  const result = await subscriberService.querySubscriber(filters, options, req, { scheme: 'Subscriber', Nolanguage: true, type: filter.type });
  res.send(result);
});


const getSubscriber = catchAsync(async (req, res) => {
  const Subscriber = await subscriberService.getSubscriberById(req.params.id);
  if (!Subscriber) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  res.send(Subscriber);
});

const updateSubscriber = catchAsync(async (req, res) => {
  const Subscriber = await subscriberService.updateSubscriberById(req.params.id, req.body);
  res.send(Subscriber);
});

const deleteSubscriber = catchAsync(async (req, res) => {
  const Subscriber = await subscriberService.deleteSubscriberById(req.params.id);
  res.send(Subscriber);
});

module.exports = {
  createSubscriber,
  getSubscriber,
  getSubscribers,
  updateSubscriber,
  deleteSubscriber,
};
