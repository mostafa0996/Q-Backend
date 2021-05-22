const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { shipmentsService, logsShipmentsService } = require('../services');
const i18next = require('i18next');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const { normal, company, response, driver } = require('../config/contant');
const { Shipments, ShipmentsLogs } = require('../models');

const moment = require('moment');
const { formatNumberLength } = require('../middlewares/rateLimiter');
const userService = require('../services/user.service');
const { getShipmentsById } = require('../services/shipments.service');
const fcmService = require('../services/fcm.service');
const twilloService = require('../services/twillo.service');
const shipmentsLogsService = require('../services/shipments.logs.service');
const addressService = require('../services/address.service');
const addressShipmentsService = require('../services/address.shipments.service');

const emailService = require('../services/email.service');
const notificationService = require('../services/notification.service');
const config = require('../config/config');

const createShipmentsGuest = catchAsync(async (req, res) => {
  await twilloService.Verify(req.body.otp, req.body.user.phone);

  const user = await userService.createUserGuest(req.body.user);

  req.body.from.user = user.id;
  req.body.to.user = user.id;

  await addressShipmentsService.createAddress(req.body.from, req);
  await addressShipmentsService.createAddress(req.body.to, req);

  const from = await addressShipmentsService.createAddress(req.body.from, req);
  const to = await addressShipmentsService.createAddress(req.body.to, req);

  console.log(user.id, from._id, to._id);

  req.body.shipment.from = from._id;
  req.body.shipment.to = to._id;

  // generate tag
  var TAG =
    moment(new Date()).format('YY') +
    moment(new Date()).format('DD') +
    moment(new Date()).format('mm') +
    formatNumberLength(await Shipments.countDocuments());
  req.body.shipment.tag = TAG;

  // to get user form token if there is any normal user creating this request if admin createing this request check if he us passsing user id or not.
  if (user) {
    req.body.shipment.user = user._id ? user._id : user.id;
  } else {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'something went wrong while creating guest user'
    );
  }

  const shipmemt = await shipmentsService.createShipments(
    req.body.shipment,
    req
  );
  res.status(httpStatus.CREATED).send(shipmemt);

  if (shipmemt && shipmemt.userObj.fcm.length !== 0) {
    var message =
      i18next.t(
        'We received your shipment request and will be processed soon. You can track your order through our DeliverQ mobile app or visit deliverQ.com'
      ) +
      '. \n\nTrackingId# ' +
      shipmemt.tag;
    twilloService.sendSMSNotification(`+201002192057`, message);
    message =
      i18next.t(
        'We received your shipment request and will be processed soon. You can track your order through our DeliverQ mobile app or visit deliverQ.com'
      ) + '.';
    fcmService.send({
      fcm: Array.from(shipmemt.userObj.fcm),
      title: i18next.t('Shipment Request'),
      description: message,
      data: {
        id: String(shipmemt._id),
        link:
          'https://www.deliverq.com/dashboard/pages/shipment-details/' +
          shipmemt._id +
          '/' +
          new Date().toISOString(),
      },
    });
  }

  notificationService.createNotifications({
    title_en: i18next.t('Shipment Request'),
    title_ar: i18next.t('Shipment Request'),
    description_en:
      i18next.t(
        'We received your shipment request and will be processed soon. You can track your order through our DeliverQ mobile app or visit deliverQ.com'
      ) + '.',
    description_ar:
      i18next.t(
        'We received your shipment request and will be processed soon. You can track your order through our DeliverQ mobile app or visit deliverQ.com'
      ) + '.',
    actionurl: shipmemt._id,
    actionData: shipmemt._id,
    user: shipmemt.userObj.id ? shipmemt.userObj.id : shipmemt.userObj._id,
  });
  console.log(shipmemt.userObj);
  emailService.BookingCreateEmailByGen(
    shipmemt.userObj.email,
    shipmemt.userObj.first_name,
    i18next.t('Shipment Request'),
    i18next.t('Thanks for choosing DeliverQ Portal'),
    i18next.t(
      'We received your shipment request and your shipment is initiated, you can track your shipment by clicking on below track button.'
    ),
    config.WEBSITE + '/tracking/' + req.body.tag,
    req.body.tag
  );

  // scheduling this request for companies
  const lastlimitForLogs = await ShipmentsLogs.find({
    shipment: new mongoose.Types.ObjectId(shipmemt._id),
    status: { $ne: 0 },
  });
  CrowdJobForShipments(req, shipmemt, lastlimitForLogs.length);
});

const otpSend = catchAsync(async (req, res) => {
  await twilloService.sendOTP(req.body.phone, req.headers['accept-language']);
  res.send(
    response(
      httpStatus.OK,
      i18next.t('OTP has been sent to +971') +
        req.body.phone +
        ' ' +
        i18next.t('mobile no'),
      null
    )
  );
});

const createShipments = catchAsync(async (req, res) => {
  // generate tag
  var TAG =
    moment(new Date()).format('YY') +
    moment(new Date()).format('DD') +
    moment(new Date()).format('mm') +
    formatNumberLength(await Shipments.countDocuments());
  req.body.tag = TAG;

  // to get user form token if there is any normal user creating this request if admin createing this request check if he us passsing user id or not.
  if (req.user && req.user.role === normal) {
    req.body.user = req.user._id ? req.user._id : req.user.id;
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'user is required');
  }

  var fromBackup = await addressService.getAddressById(req.body.from);
  var tobackup = await addressService.getAddressById(req.body.to);

  console.log('req.body', fromBackup.name, fromBackup, !fromBackup.name);
  delete fromBackup._id;
  delete tobackup._id;
  if (!fromBackup.name) {
    fromBackup.name = '';
  }
  if (!tobackup.name) {
    tobackup.name = '';
  }

  var from = await addressShipmentsService.createAddress(fromBackup, req);
  var to = await addressShipmentsService.createAddress(tobackup, req);

  req.body.from = from.id ? from.id : from._id;
  req.body.to = to.id ? to.id : to._id;

  const shipmemt = await shipmentsService.createShipments(req.body, req);
  console.log('req.body', req.body);
  res.status(httpStatus.CREATED).send(shipmemt);

  // scheduling this request for companies
  const lastlimitForLogs = await ShipmentsLogs.find({
    shipment: new mongoose.Types.ObjectId(shipmemt._id),
    status: { $ne: 0 },
  });

  notificationService.createNotifications({
    title_en: i18next.t('Shipment Request'),
    title_ar: i18next.t('Shipment Request'),
    description_en:
      i18next.t(
        'We received your shipment request and will be processed soon. You can track your order through our DeliverQ mobile app or visit deliverQ.com'
      ) + '.',
    description_ar:
      i18next.t(
        'We received your shipment request and will be processed soon. You can track your order through our DeliverQ mobile app or visit deliverQ.com'
      ) + '.',
    actionurl: shipmemt._id,
    actionData: shipmemt._id,
    user: shipmemt.userObj.id ? shipmemt.userObj.id : shipmemt.userObj._id,
  });
  emailService.BookingCreateEmailByGen(
    shipmemt.userObj.email,
    shipmemt.userObj.first_name,
    i18next.t('Shipment Request'),
    i18next.t('Thanks for choosing DeliverQ Portal'),
    i18next.t(
      'We received your shipment request and will be processed soon. You can track your order through our DeliverQ mobile app or visit deliverQ.com, you can track your shipment by clicking on below track button.'
    ),
    config.WEBSITE + '/tracking/' + req.body.tag,
    req.body.tag
  );

  if (shipmemt && shipmemt.userObj.fcm.length !== 0) {
    var message =
      i18next.t(
        'We received your shipment request and will be processed soon. You can track your order through our DeliverQ mobile app or visit deliverQ.com'
      ) +
      '. \n\nTrackingId# ' +
      shipmemt.tag;
    twilloService.sendSMSNotification(shipmemt.userObj.phone, message);
    message =
      i18next.t(
        'We received your shipment request and will be processed soon. You can track your order through our DeliverQ mobile app or visit deliverQ.com'
      ) + '.';
    fcmService.send({
      fcm: Array.from(shipmemt.userObj.fcm),
      title: 'DeliverQ',
      description: message,
      data: {
        id: String(shipmemt._id),
        link:
          'https://www.deliverq.com/dashboard/pages/shipment-details/' +
          shipmemt._id +
          '/' +
          new Date().toISOString(),
      },
    });
  }

  await LocationUpdates(req, shipmemt);
  console.log('done');
  CrowdJobForShipments(req, shipmemt, lastlimitForLogs.length);
});

const LocationUpdates = async (req, shipmemt) => {
  req.query.category = shipmemt.subCategoryObj.category;
  req.query.role = company;
  const keyword = pick(req.query, ['search', 'category', 'role']);
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var keywords = [];
  keywords.push({ active: 1 });
  if (keyword.search) {
    keywords.push({
      name: { $regex: '.*' + keyword.search + '.*', $options: 'i' },
    });
  }

  if (filter.role) {
    keywords.push({ role: filter.role });
  }

  var result = await userService.queryUsers(keywords, options, keywords);

  for (let k in result.results) {
    if (!!!result.results[k].loc.coordinates) {
      (result.results[k].loc = {
        type: 'Point',
        coordinates: [
          Number(result.results[k].lat),
          Number(result.results[k].lng),
        ],
      }),
        await userService.updateUserByIdSimple(
          result.results[k]._id,
          result.results[k]
        );
      console.log(
        'result.results[k].loc',
        result.results[k].loc,
        result.results[k].lat
      );
    }
  }
};

const CrowdJobForShipments = async (req, shipmemt, lastlimitForLogs) => {
  req.query.category = shipmemt.subCategoryObj.category;
  req.query.role = company;
  const keyword = pick(req.query, ['search', 'category', 'role']);
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var keywords = [];
  keywords.push({ active: 1 });
  if (keyword.search) {
    keywords.push({
      name: { $regex: '.*' + keyword.search + '.*', $options: 'i' },
    });
  }

  if (filter.role) {
    keywords.push({ role: filter.role });
  }

  if (shipmemt.shipmentslogs.length) {
    for (let k in shipmemt.shipmentslogs) {
      if (shipmemt.shipmentslogs[k].to)
        keywords.push({
          _id: {
            $ne: new mongoose.Types.ObjectId(shipmemt.shipmentslogs[k].to._id),
          },
        });
    }
    console.log(
      'some companies are removed becuase they already received request ',
      keywords
    );
  }

  // console.log(shipmemt);
  console.log({
    lat: Number(shipmemt.fromObj.lat),
    lng: Number(shipmemt.fromObj.lng),
  });
  var result = await userService.queryUsersByDistance(
    keywords,
    options,
    keywords,
    { lat: Number(shipmemt.fromObj.lat), lng: Number(shipmemt.fromObj.lng) }
  );

  // sort by distance
  result.results.sort((a, b) => {
    if (a.calculated < b.calculated) return -1;
    if (a.calculated > b.calculated) return 1;
    return 0;
  });

  console.log(result.results.length);

  if (result.results.length > 0) {
    for (let k in result.results) {
      const latestShipmentDetails = await getShipmentsById(shipmemt._id, req);

      // get updated service provider
      var keywords = [];
      keywords.push({ active: 1 });
      keywords.push({ role: filter.role });
      keywords.push({
        _id: new mongoose.Types.ObjectId(result.results[k]._id),
      });
      result.results[k] = (
        await userService.queryUsersByDistance(keywords, options, keywords, {
          lat: Number(shipmemt.fromObj.lat),
          lng: Number(shipmemt.fromObj.lng),
        })
      ).results[0];
      const latestShipmentLogDetails = await ShipmentsLogs.find({
        shipment: new mongoose.Types.ObjectId(shipmemt._id),
        status: { $ne: 0 },
      });
      if (latestShipmentLogDetails.length === lastlimitForLogs)
        if (
          await checkIfPossibleToMove(
            latestShipmentDetails,
            result.results[k],
            lastlimitForLogs
          )
        )
          await delay(5000 * 60);
    }

    // set shipment assigned status to -1 so all reauest by this status are for admin ,they will assigned this manually
    // console.log('from again', lastlimitForLogs)
    const latestShipmentLogDetails = await ShipmentsLogs.find({
      shipment: new mongoose.Types.ObjectId(shipmemt._id),
      status: { $ne: 0 },
    });
    if (latestShipmentLogDetails.length === lastlimitForLogs) {
      const latestShipmentDetails = await getShipmentsById(shipmemt._id, req);
      if (latestShipmentDetails.assignedStatus === 0) {
        console.log('send request to DeliverQ');
        assignAdmin(req, shipmemt._id);
      } else {
        console.log('shipment already assigned someone accepted');
      }
    }
  } else {
    console.log('send request to DeliverQ');
    // set shipment assigned status to -1 so all reauest by this status are for admin ,they will assigned this manually
    assignAdmin(req, shipmemt._id);
  }
};

const assignAdmin = async (req, shipmemtId) => {
  await shipmentsService.updateShipmentsById(
    shipmemtId,
    { assignedStatus: -1 },
    req
  );
};

const checkIfPossibleToMove = async (shipment, company, lastlimitForLogs) => {
  if (shipment.assignedStatus === 0) {
    // semding shipment to that user
    var shipmentlog = await logsShipmentsService.createShipmentsLog({
      to: company._id,
      distance: Number(company.calculated / 1000).toFixed(2),
      time: new Date(),
      status: 0,
      shipment: shipment._id,
    });
    twilloService.sendSMSNotification(
      company.phone,
      i18next.t('Hi there') +
        ',\n' +
        i18next.t('You have new shipment request from DeliverQ') +
        ' \n' +
        config.DASHBOARD +
        '/pages/shipment-details/' +
        shipment._id +
        '/' +
        new Date().toISOString() +
        '\n' +
        i18next.t('Happy delivering…') +
        '\n' +
        i18next.t('Regards') +
        ',\n' +
        i18next.t('Team DeliverQ')
    );
    emailService.sendEmail(
      company.email,
      i18next.t('Shipment Request'),
      '<p>' +
        i18next.t('Hi there') +
        ',<br>' +
        i18next.t('You have new shipment request from DeliverQ') +
        ' <br>' +
        config.DASHBOARD +
        '/pages/shipment-details/' +
        shipment._id +
        '/' +
        new Date().toISOString() +
        '<br>' +
        i18next.t('Happy delivering…') +
        '<br>' +
        i18next.t('Regards') +
        ',<br>' +
        i18next.t('Team DeliverQ') +
        '</p>'
    );
    if (company.fcm.length !== 0) {
      fcmService.send({
        fcm: Array.from(company.fcm),
        title: i18next.t('Shipment Request'),
        description: i18next.t('You have new shipment request from DeliverQ'),
        data: {
          id: shipmentlog._id,
          link:
            config.DASHBOARD +
            '/pages/shipment-details/' +
            shipment._id +
            '/' +
            new Date().toISOString(),
        },
      });
    } else {
      console.log('unable to send push notfiication fcm are here', company.fcm);
    }
    return true;
  } else {
    console.log(
      'shipment already assigned someone accepted or rejection callback'
    );
    return false;
  }
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getShipmentss = catchAsync(async (req, res) => {
  console.log({
    query: req.query
  })
  if (req.user.role === normal) {
    req.query.user = req.user.id;
  }
  if (req.user.role === driver) {
    req.query.driver = req.user.id;
  }

  const filter = pick(req.query, [
    'status',
    'user',
    'from',
    'to',
    'subCategory',
    'weight',
    'comments',
    'deliveryDate',
    'createdAt',
    'tag',
    'company',
    'driver',
    'tag',
    'assignedStatus',
    'startDate',
    'endDate',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter.comments) {
    filters.push({
      subject: { $regex: '.*' + filter.comments + '.*', $options: 'i' },
    });
  }

  if (
    filter.status !== undefined &&
    filter.status !== '' &&
    String(filter.status) !== '-1'
  ) {
    filters.push({ status: Number(filter.status) });
  }

  if (filter.assignedStatus && String(filter.assignedStatus) !== '-1') {
    filters.push({ assignedStatus: Number(filter.assignedStatus) });
  }

  if (filter.user) {
    filters.push({ user: new mongoose.Types.ObjectId(filter.user) });
  }
  if (filter.company) {
    filters.push({ company: new mongoose.Types.ObjectId(filter.company) });
  }
  if (filter.driver) {
    filters.push({ driver: new mongoose.Types.ObjectId(filter.driver) });
  }
  if (filter.from) {
    filters.push({ from: new mongoose.Types.ObjectId(filter.from) });
  }
  if (filter.subCategory) {
    filters.push({
      subCategory: new mongoose.Types.ObjectId(filter.subCategory),
    });
  }
  if (filter.to) {
    filters.push({ to: new mongoose.Types.ObjectId(filter.to) });
  }
  if (filter.tag) {
    filters.push({ tag: filter.tag });
  }
  if (filter.weight) {
    filters.push({ weight: filter.weight });
  }
  if (filter.deliveryDate) {
    filters.push({
      createdAt: { $gt: filter.deliveryDate, $lt: filter.deliveryDate },
    });
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
  console.log({filters: JSON.stringify(filters)})
  const result = await shipmentsService.queryShipments(filters, options, req);
  res.send(result);
});

const getShipmentsCount = catchAsync(async (req, res) => {
  const keyword = pick(req.query, ['search']);
  const filter = pick(req.query, ['name', 'role', 'company']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var keywords = [];

  //start
  var keywords = [];
  if (keyword.search) {
    if (filter.role) {
      keywords.push({
        $or: [
          {
            first_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' },
          },
          {
            last_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' },
          },
          { phone: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { email: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          {
            company_name: {
              $regex: '.*' + keyword.search + '.*',
              $options: 'i',
            },
          },
        ],
        $and: [{ role: filter.role }],
      });
    } else {
      keywords.push({
        $or: [
          {
            first_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' },
          },
          {
            last_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' },
          },
          { phone: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { email: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          {
            company_name: {
              $regex: '.*' + keyword.search + '.*',
              $options: 'i',
            },
          },
        ],
      });
    }
  } else {
    if (filter.role) {
      keywords.push({ role: filter.role });
    }
  }

  //end

  if (filter.company) {
    keywords.push({ company: new mongoose.Types.ObjectId(filter.company) });
  }

  const result = await userService.queryUsersCountShipments(
    keywords,
    options,
    keywords,
    req.user ? req.user.id : undefined
  );
  res.send(result);
});

const getShipments = catchAsync(async (req, res) => {
  const Shipments = await shipmentsService.getShipmentsById(req.params.id, req);
  if (!Shipments) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  var filters = [];
  filters.push({ _id: new mongoose.Types.ObjectId(req.params.id) });
  const result = await shipmentsService.queryShipments(filters, [], req);
  res.send(result.results[0]);
});

const getShipmentByTag = catchAsync(async (req, res) => {
  var filters = [];
  filters.push({ tag: req.params.tag });
  const objectShipment = await Shipments.paginateuser(filters, [], req);
  if (!objectShipment.results[0]) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'No Shipment Found with this tracking number.'
    );
  }
  console.log(objectShipment.results[0]);
  res.send(objectShipment.results[0]);
});

const updateShipments = catchAsync(async (req, res) => {
  const Shipments = await shipmentsService.updateShipmentsById(
    req.params.id,
    req.body,
    req
  );
  res.send(Shipments);
});

const assignCompany = catchAsync(async (req, res) => {
  const Shipments = await shipmentsService.updateShipmentsById(
    req.params.id,
    {
      company: req.body.company,
      assignedStatus: 1,
      companyAssignDate: new Date(),
    },
    req
  );
  res.send(Shipments);
});

const updateStatus = catchAsync(async (req, res) => {
  var Shipments = null;

  if (req.body.status === 1) {
    Shipments = await shipmentsService.updateShipmentsById(
      req.params.id,
      { status: req.body.status, pickedhDate: new Date() },
      req
    );
  } else if (req.body.status === 2) {
    Shipments = await shipmentsService.updateShipmentsById(
      req.params.id,
      { status: req.body.status, dispatchDate: new Date() },
      req
    );
  } else if (req.body.status === 3) {
    Shipments = await shipmentsService.updateShipmentsById(
      req.params.id,
      { status: req.body.status, deliverdDate: new Date() },
      req
    );
  } else {
    Shipments = await shipmentsService.updateShipmentsById(
      req.params.id,
      {
        status: req.body.status,
      },
      req
    );
  }

  var message =
    Shipments.status === 1
      ? i18next.t(
          'Your shipment is successfully picked by our delivery team with responsibility.'
        )
      : Shipments.status === 2
      ? i18next.t('Our Pilot is on the way to deliver your shipment.')
      : i18next.t(
          'You Shipment is delivered successfully with love and care. Keep shipment with DeliverQ. Stay Healthy, Thank you.'
        );
  twilloService.sendSMSNotification(Shipments.userObj.phone, message);
  if (Shipments && Shipments.userObj.fcm.length !== 0) {
    fcmService.send({
      fcm: Array.from(Shipments.userObj.fcm),
      title: 'DeliverQ',
      description: message,
      data: {
        id: String(Shipments._id),
        link:
          'https://www.deliverq.com/dashboard/pages/shipment-details/' +
          Shipments._id +
          '/' +
          new Date().toISOString(),
      },
    });
    notificationService.createNotifications({
      title_en: i18next.t('Shipment #') + Shipments.tag,
      title_ar: i18next.t('Shipment #') + Shipments.tag,
      description_en: message,
      description_ar: message,
      actionurl: Shipments._id,
      actionData: Shipments._id,
      user: Shipments.userObj.id ? Shipments.userObj.id : Shipments.userObj._id,
    });
  }
  res.send(Shipments);
});

const acceptOrReject = catchAsync(async (req, res) => {
  const latestShipmentLogDetails = await ShipmentsLogs.find({
    shipment: new mongoose.Types.ObjectId(req.params.id),
    to: new mongoose.Types.ObjectId(req.user.id),
  });
  const CheckLogsifRequestAccpted = await ShipmentsLogs.find({
    shipment: new mongoose.Types.ObjectId(req.params.id),
    status: {
      $nin: [0, 2],
    },
    to: { $ne: new mongoose.Types.ObjectId(req.user.id) },
  });

  if (!latestShipmentLogDetails[0]) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Sorry this shipment is not assigned to you.'
    );
    return;
  }

  if (latestShipmentLogDetails[0] && latestShipmentLogDetails[0].status) {
    res.send(
      response(httpStatus.OK, i18next.t('request already accpeted'), null)
    );
    return;
  }

  if (CheckLogsifRequestAccpted.length > 0) {
    res.send(
      response(
        httpStatus.OK,
        i18next.t('Request already assgined to someone else'),
        null
      )
    );
    return;
  }

  if (req.body.status === 1) {
    const Shipments = await shipmentsLogsService.updateShipmentsById(
      latestShipmentLogDetails[0]._id,
      { status: req.body.status },
      req
    );
    if (Shipments) {
      const latestShipmentDetails = await shipmentsService.updateShipmentsById(
        req.params.id,
        {
          company: req.user.id,
          assignedStatus: 1,
          companyAssignDate: new Date(),
        },
        req
      );
      res.send(
        response(
          httpStatus.OK,
          i18next.t('Request accepted'),
          latestShipmentDetails
        )
      );
      return;
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'SOMETHING WENT WRONG');
    }
  } else {
    const Shipments = await shipmentsLogsService.updateShipmentsById(
      latestShipmentLogDetails[0]._id,
      { status: req.body.status, rejectReason: req.body.rejectReason },
      req
    );
    if (Shipments) {
      const latestShipmentDetails = await getShipmentsById(req.params.id, req);
      res.send(
        response(httpStatus.OK, 'Request rejected', latestShipmentDetails)
      );

      const lastlimitForLogs = await ShipmentsLogs.find({
        shipment: new mongoose.Types.ObjectId(latestShipmentDetails._id),
        status: { $ne: 0 },
      });
      // RESTART PRORESS
      CrowdJobForShipments(req, latestShipmentDetails, lastlimitForLogs.length);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'SOMETHING WENT WRONG');
      return;
    }
  }
});

const cancelShipment = catchAsync(async (req, res) => {
  const latestShipmentLogDetails = await ShipmentsLogs.find({
    shipment: new mongoose.Types.ObjectId(req.params.id),
    to: new mongoose.Types.ObjectId(req.user.id),
  });
  const CheckLogsifRequestAccpted = await ShipmentsLogs.find({
    shipment: new mongoose.Types.ObjectId(req.params.id),
    status: { $ne: 0 },
    to: { $ne: new mongoose.Types.ObjectId(req.user.id) },
  });

  if (!latestShipmentLogDetails[0]) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SOMETHING WENT WRONG');
    return;
  }

  console.log(latestShipmentLogDetails[0].status);
  if (latestShipmentLogDetails[0].status === 3) {
    res.send(
      response(
        httpStatus.OK,
        i18next.t('unable to cancel or already canceled'),
        null
      )
    );
    return;
  }

  if (CheckLogsifRequestAccpted.length > 0) {
    res.send(
      response(
        httpStatus.OK,
        i18next.t('Request already assgined to someone else'),
        null
      )
    );
    return;
  }

  const Shipments = await shipmentsLogsService.updateShipmentsById(
    latestShipmentLogDetails[0]._id,
    { status: 3, rejectReason: req.body.rejectReason },
    req
  );

  if (Shipments) {
    const latestShipmentDetails = await shipmentsService.updateShipmentsById(
      req.params.id,
      { company: null, assignedStatus: 0, companyAssignDate: new Date() },
      req
    );
    res.send(
      response(
        httpStatus.OK,
        i18next.t('Request canceled'),
        latestShipmentDetails
      )
    );

    const lastlimitForLogs = await ShipmentsLogs.find({
      shipment: new mongoose.Types.ObjectId(latestShipmentDetails._id),
      status: { $ne: 0 },
    });
    // RESTART PRORESS
    CrowdJobForShipments(req, latestShipmentDetails, lastlimitForLogs.length);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'SOMETHING WENT WRONG');
    return;
  }
});

const assignDriver = catchAsync(async (req, res) => {
  const Shipments = await shipmentsService.updateShipmentsById(
    req.params.id,
    {
      driver: req.body.driver,
      assignedStatus: 2,
      driverAssignDate: new Date(),
    },
    req
  );
  if (Shipments && Shipments.driverObj.fcm.length !== 0) {
    fcmService.send({
      fcm: Array.from(Shipments.driverObj.fcm),
      title: i18next.t('DeliverQ'),
      description: i18next.t(
        'You have assigned for the delivery from your company.'
      ),
      data: {
        id: String(Shipments._id),
        link:
          'https://www.deliverq.com/dashboard/pages/shipment-details/' +
          Shipments._id +
          '/' +
          new Date().toISOString(),
      },
    });
  }
  res.send(Shipments);
  emailService.sendEmail(
    Shipments.driverObj.email,
    i18next.t('Shipment Assigned'),
    '<p>' +
      i18next.t('Hi There') +
      ',\n' +
      i18next.t('You have assigned to deliver the parcel of') +
      ' #' +
      Shipments.tag +
      ' ' +
      i18next.t('from your company') +
      '.\n' +
      i18next.t('Drive safe') +
      '.</p>\n' +
      i18next.t('Regards') +
      ',\n' +
      i18next.t('DeliverQ Team')
  );
});

const deleteShipments = catchAsync(async (req, res) => {
  const Shipments = await shipmentsService.deleteShipmentsById(
    req.params.id,
    req
  );
  res.send(Shipments);
});

module.exports = {
  createShipments,
  getShipmentss,
  deleteShipments,
  updateShipments,
  getShipments,
  getShipmentByTag,
  assignDriver,
  assignCompany,
  acceptOrReject,
  updateStatus,
  createShipmentsGuest,
  otpSend,
  getShipmentsCount,
  cancelShipment,
};
