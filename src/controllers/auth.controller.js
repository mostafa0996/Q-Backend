const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, twilloService ,infoService} = require('../services');
const { response, normal, company } = require('../config/contant');
var fs = require("fs");
const { User } = require('../models');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const i18next = require('i18next');


const register = catchAsync(async (req, res) => {

  await twilloService.Verify(req.body.otp, req.body.phone);

  if (req.body.role === company) {
    req.body.active = 0;
    req.body.loc = [Number(req.body.lat), Number(req.body.lng)];
  } else {
    req.body.active = 1;
  }

  const user = await userService.createUser(req.body);
  if (req.body.role === normal) {
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } else {
    infoService.sendEmail('enquiry@deliverq.com', 'Company Request', '<p>' + 'Hi Deliverq ' +
      '<br/>Your have new company registration request. please use the below credentials to log in to your account, click here to open dashboard ' +
      config.DASHBOARD + 'pages/supplier-details/' + (user.id ? user.id : user._id) + '</b><br/><br/>*If you did not make this request, you can safely ignore this email' + '</p>')
    res.status(httpStatus.CREATED).send({ message: 'your account is successfully created but still in under review by delivery team we will notify you soon.' });
  }
});





const updatePassword = catchAsync(async (req, res) => {
  await twilloService.Verify(req.body.otp, req.body.phone);
  var user = await User.Phone(req.body.phone);
  if (user) {
    await authService.changePassword(user._id, req.body.password);
    res.send({ status: httpStatus.OK, message: i18next.t('Your password changed successfully now you can login!') });
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid phone number');
  }

});


const otpSend = catchAsync(async (req, res) => {
  if (req.body.type === 1) {
    await userService.checkUserWithDetails(req.body, req);
  } else {
    await userService.checkUserExistWithDetails(req.body, req);
  }

  await twilloService.sendOTP(req.body.phone, req.headers["accept-language"]);
  res.send(response(httpStatus.OK, i18next.t('OTP has been sent to +971') + req.body.phone + ' ' + i18next.t('mobile no'), null));
});



const otpSendWithoutCheck = catchAsync(async (req, res) => {

  if (req.body.type) {
    var user = await User.Phone(req.body.phone);

    if (user) {
      await twilloService.sendOTP(req.body.phone, req.headers["accept-language"]);
      res.send(response(httpStatus.OK, i18next.t('OTP has been sent to +971') + req.body.phone + ' ' + i18next.t('mobile no'), null));

    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invalid phone number');

    }
  } else {
    await twilloService.sendOTP(req.body.phone, req.headers["accept-language"]);
    res.send(response(httpStatus.OK, i18next.t('OTP has been sent to +971') + req.body.phone + ' ' + i18next.t('mobile no'), null));

  }


});



const registerSocial = catchAsync(async (req, res) => {
  const user = await userService.createUserSocial(req.body, req);
  console.log(user);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password, role } = req.body;
  console.log({ email, password });
  var user = await authService.loginUserWithEmailAndPassword(email, password, role, req);
  const tokens = await tokenService.generateAuthTokens(user);
  user = await userService.getUserByIdDetails(user._id, req)

  res.send({ user, tokens });
});




const loginAdmin = catchAsync(async (req, res) => {
  const { email, password, role } = req.body;
  console.log({ email, password });
  var user = await authService.loginUserWithEmailAndPasswordAdmins(email, password, req);
  const tokens = await tokenService.generateAuthTokens(user);
  user = await userService.getUserByIdDetails(user._id, req)

  res.send({ user, tokens });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken, req.protocol + "://" + req.get('host') + req.originalUrl);
  res.send(response(httpStatus.OK, 'Please check your email to change your password', null));
});

const changePasswordView = catchAsync(async (req, res) => {
  if (!req.query.password || req.query.password === '') {
    res.writeHead(404, { "Content-Type": "text/html" });
    fs.createReadStream(require('path').resolve('src/rest-password/reset.html')).pipe(res);
  } else {
    await authService.resetPassword(req.query.token, req.query.password, res);
    res.writeHead(404, { "Content-Type": "text/html" });
    fs.createReadStream(require('path').resolve('src/rest-password/forgot.html')).pipe(res);
  }

});


const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user.id, req.body.password_new);
  res.send({ status: httpStatus.OK, message: 'Success!' });
});


const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.send(response(httpStatus.OK, i18next.t('Password has been successfully updated'), null));
});
const profile = catchAsync(async (req, res) => {
  console.log(req.params);
  const user = await authService.profile(req.params.userId);
  res.send({ user });
});
const active = catchAsync(async (req, res) => {
  await authService.active(req.query.token);
  res.writeHead(404, { "Content-Type": "text/html" });
  fs.createReadStream(require('path').resolve('src/rest-password/accountActivated.html')).pipe(res);
});
const verification = catchAsync(async (req, res) => {
  console.log(req.get('host'))
  console.log(req.originalUrl)
  await authService.verification(req.query.email, req.protocol + "://" + req.get('host') + '/v1/auth/register');
  res.send(response(httpStatus.OK, 'Verificaiton email is sent.', null));
});



module.exports = {
  registerSocial,
  register,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
  profile,
  active,
  verification,
  changePasswordView,
  otpSend,
  otpSendWithoutCheck,
  changePassword,
  updatePassword,
  loginAdmin
};
