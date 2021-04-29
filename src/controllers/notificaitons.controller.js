const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
const mongoose = require("mongoose");


const getNotifications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'status', 'app', 'keyword']);
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'isPagination']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }
  if (req.user) {
    filters.push({ user: new mongoose.Types.ObjectId(req.user.id) })
  }
  const result = await notificationService.queryNotifications(filters, options, req, { scheme: 'Notification' });
  res.send(result);
});



const deleteNotification = catchAsync(async (req, res) => {
  const Notification = await notificationService.deleteNotificationsById(req.params.id);
  res.send(Notification);
});

const readNotification = catchAsync(async (req, res) => {
  const Notification = await notificationService.readNotification(req.params.id);
  res.send(Notification);
});

module.exports = {
  getNotifications,
  deleteNotification,
  readNotification
};
