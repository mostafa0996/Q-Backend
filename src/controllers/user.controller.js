const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, emailService, tokenService } = require('../services');
const authService = require('../services/auth.service');
const mongoose = require("mongoose");
const config = require('../config/config');
const { User } = require('../models');
const { driver } = require('../config/contant');
const i18next = require('i18next');





const randomPassword = (async (length) => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
});
const randomPasswordChar = (async (length) => {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
});


const createUser = catchAsync(async (req, res) => {
  try {
    delete req.body._id;

    if (req.body.password === '' || req.body.password == null || req.body.password === 'a12345678')
      req.body.password = await randomPasswordChar(2) + await randomPassword(6) + await randomPasswordChar(2);
  
  
    req.body.active = 1;
    const user = await userService.createUser(req.body, req);
  
    if (req.body.role === driver) {
      emailService.sendEmail_v1(req.body.email, i18next.t('Welcome to DelierQ'), '<p>' + i18next.t('Hi') + ' ' + req.body.first_name + '<br/> ' + i18next.t('Your account is created by deliverQ. please use the below credentials to log in to your account, please log in to DeliverQ app') +
        '. <br/><br/>' + i18next.t('Email') + ' : <b>' + req.body.email + '</b><br/>' + i18next.t('Password') + ' : <b>' + req.body.password + '</b><br/><br/>' + i18next.t('*If you did not make this request, you can safely ignore this email') + '</p>')
    } else {
      emailService.sendEmail(req.body.email, i18next.t('Welcome to DelierQ'),
    ` Hi ${req.body.first_name}
      Your account is created by deliverQ. please use the below credentials to log in to your account, click here to open dashboard ${config.DASHBOARD}.
      Email: ${req.body.email}
      Password: ${req.body.password}
      *If you did not make this request, you can safely ignore this email
    `
      )}
    res.status(httpStatus.CREATED).send(user);
  } catch (error) {
    console.error(error);
    res.status(error.status).send(error.message)
  }
});

const getUsers = catchAsync(async (req, res) => {

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
          { first_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { last_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { phone: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { email: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { company_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
        ],
        $and: [
          { role: filter.role },
        ]
      })
    } else {
      keywords.push({
        $or: [
          { first_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { last_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { phone: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { email: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
          { company_name: { $regex: '.*' + keyword.search + '.*', $options: 'i' } },
        ]
      })
    }
  } else {
    if (filter.role) {
      keywords.push({ role: filter.role })
    }
  }

  //end



  if (filter.company) {
    keywords.push({ company: new mongoose.Types.ObjectId(filter.company) })
  }

  console.log(keywords);
  const result = await userService.queryUsers(keywords, options, keywords, req.user ? req.user.id : undefined);

  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserByIdDetails(req.user.id, req);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND')
  }
  res.send(user);
});


const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserByIdDetails(req.params.userId, req);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND')
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {



  if (req.body.password === '') {
    delete req.body.password;
  }
  if (req.body.password === null) {
    delete req.body.password;
  }

  const user = await userService.updateUserById(req.user.id, req.body, req);
  if (req.body.new_password) {
    await authService.checkUserWithEmailAndPassword(req.user.email, req.body.old_password, req);
    await authService.changePassword(req.user.id, req.body.new_password);
  }
  res.send({ status: httpStatus.OK, message: i18next.t('Your profile is successfully updated!'), user });
});


const updateUserbyadmin = catchAsync(async (req, res) => {


  if (req.body.password === '') {
    delete req.body.password;
  }
  if (req.body.password === null) {
    delete req.body.password;
  }
  if (req.body.password) {
    emailService.sendEmail(req.body.email, i18next.t('Password Changed'), '<p>' + i18next.t('Hi') + ' ' + req.body.first_name + '<br/>' + i18next.t('Your account password is updated by deliverQ. please use the below credentials to log in to your account, click here to open dashboard')
      + config.DASHBOARD + '. < br /> <br />' + i18next.t('Email') + ' : <b>' + req.body.email + '</b><br/>' + i18next.t('Password') + ' : <b>' + req.body.password + '</b><br/><br/> ' + i18next.t('* If you did not make this request, you can safely ignore this email') + '</p > ')
  }


  const user = await userService.updateUserById(req.params.userId, req.body, req);
  res.send({ status: httpStatus.OK, message: i18next.t('Your profile is successfully updated!'), user });
});


const updatePassword = catchAsync(async (req, res) => {
  if (!req.user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  await authService.checkUserWithEmailAndPassword(req.user.email, req.body.old_password, req);
  await authService.changePassword(req.user.id, req.body.new_password);
  res.send({ status: httpStatus.OK, message: i18next.t('Your password is successfully updated!') });
});


const updateGuestPasswordAndActiveAccount = catchAsync(async (req, res) => {

  await authService.changePassword(req.body.user, req.body.new_password);
  await User.findByIdAndUpdate(req.body.user, { $set: { guest: 0, active: 1 } });

  res.send({
    status: httpStatus.OK, message: i18next.t('Your account is created successfully!'),
  });
});




const AccpectOrRejectCompanyAccount = catchAsync(async (req, res) => {
  var user = await User.findByIdAndUpdate(req.body.user, { $set: { active: req.body.active } });

  user = await userService.getUserById(req.body.user)
  console.log(user)
  if (user) {
    if (req.body.active === 1) {
      emailService.sendEmail(user.email, i18next.t('Welcome to DelierQ'), '<p>' + i18next.t('Hi') + ' ' + user.first_name
        + '<br/> ' + i18next.t('Your account has beed approved by deliverQ. please use the your credentials to log in to your account, click here to open dashboard') + config.DASHBOARD
        + '</b><br/><br/>' + i18next.t('*If you did not make this request, you can safely ignore this email') + '</p>')

    } else {
      emailService.sendEmail(user.email, i18next.t('Welcome to DelierQ'), '<p>' + i18next.t('Hi') + ' ' + user.first_name
        + '<br/>.' + i18next.t('Your account has beed rejected by deliverQ. feel free to contact us if you have any quries about this action') +
        + '</b><br/><br/>' + i18next.t('*If you did not make this request, you can safely ignore this email') + '</p>')
    }

    res.send({
      status: httpStatus.OK, message: i18next.t('account is updated successfully!'), user: user
    });
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND')
  }

});



const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send();
});


const updateFcm = catchAsync(async (req, res) => {
  console.log({ id: req.user.id, fcm: req.body.fcm })
  var fcm = await userService.updateFcm(req.user.id, req.body.fcm);
  res.send({ fcm: fcm });
});


const createUserPermission = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, { $addToSet: { permissions: req.params.permissionId } });



  const user = await userService.getUserByIdDetails(req.params.userId, req);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND')
  }
  res.send(user);

});

const deleteUserPermission = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, { $pull: { permissions: req.params.permissionId } });

  const user = await userService.getUserByIdDetails(req.params.userId, req);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND')
  }
  res.send(user);
});








module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateFcm,
  getUserById,
  updatePassword,
  updateUserbyadmin,
  createUserPermission,
  deleteUserPermission,
  updateGuestPasswordAndActiveAccount,
  AccpectOrRejectCompanyAccount
};
