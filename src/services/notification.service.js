const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const i18next = require('i18next');
const mongoose = require("mongoose");

const createNotifications = async (Body) => {
  const object = await Notification.create(Body);
  return object;
};

const queryNotifications = async (filter, options, req, Check) => {
  const object = await Notification.paginate(filter, options, req, Check);
  return object;
};



const getNotificationsById = async (id) => {
  return Notification.findById(id);
};


const updateNotificationsById = async (NotificationsId, updateBody) => {
  const Notifications = await getNotificationsById(NotificationsId);
  if (!Notifications) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  Object.assign(Notifications, updateBody);
  await Notifications.save();
  return Notifications;
};


const readNotification = async (NotificationsId) => {
  const Notifications = await getNotificationsById(NotificationsId);
  if (!Notifications) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notifications not found');
  }

  const read = await Notification.updateOne(
    { _id: new mongoose.Types.ObjectId(NotificationsId) },
    { $set: { read: 1 } }
  );

  // const NotificationsUpdated = await getNotificationsById(NotificationsId);


  return {
    code: httpStatus.OK,
    message: i18next.t('Success'),
    // data: NotificationsUpdated
  };
};



const deleteNotificationsById = async (NotificationsId) => {
  const Notifications = await getNotificationsById(NotificationsId);
  if (!Notifications) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  await Notifications.remove();
  return {
    code: httpStatus.OK,
    message: i18next.t('Success')
  };

};


module.exports = {
  createNotifications,
  queryNotifications,
  getNotificationsById,
  updateNotificationsById,
  deleteNotificationsById,
  readNotification
};
