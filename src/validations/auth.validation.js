const Joi = require('@hapi/joi');
const { normal, company, driver } = require('../config/contant');
const { password, objectId } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    login_with: Joi.string().default('Auth'),
    password: Joi.string().required().custom(password),
    role: Joi.string().valid(normal, company, driver).default(normal),
    active: Joi.string().default(0),
    fcm: Joi.array(),
    otp: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),


    city: Joi.when('role', { is: company, then: Joi.string().custom(objectId).required(), otherwise: Joi.string() }),
    trade_licence: Joi.when('role', { is: company, then: Joi.string().required(), otherwise: Joi.string() }),
    area: Joi.when('role', { is: company, then: Joi.string().required(), otherwise: Joi.string() }),
    company_name: Joi.when('role', { is: company, then: Joi.string().required(), otherwise: Joi.string() }),

  }),
};

const active = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
const verification = {
  query: Joi.object().keys({
    email: Joi.string().required(),
  }),
};



const registerSocial = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    login_with: Joi.string().default('Auth'),
    role: Joi.string().valid(normal).default(normal),
    active: Joi.string().default(1),
    fcm: Joi.string().default([]),
    email: Joi.string().required(),
    phone: Joi.string(),
  }),
};


const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    role: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const loginAdmin = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};




const profile = {
  parms: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const changePasswordView = {
  query: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().default(''),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};


const resetPasswordOTP = {
  body: Joi.object().keys({
    otp: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};

const otpSend = {
  body: Joi.object().keys({
    phone: Joi.string().required(),
    type: Joi.number().default(0),
    email: Joi.when('type', { is: 0, then: Joi.string().required(), otherwise: Joi.string() }),
  }),
};
const otpSendWithoutCheck = {
  body: Joi.object().keys({
    phone: Joi.string().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    password_old: Joi.string().required().custom(password),
    password_new: Joi.string().required().custom(password),
  }),
};



module.exports = {
  register,
  registerSocial,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
  profile,
  active,
  verification,
  changePasswordView,
  otpSend,
  changePassword,
  resetPasswordOTP,
  otpSendWithoutCheck,
  loginAdmin
};
