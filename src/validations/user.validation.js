const Joi = require('@hapi/joi');
const { normal, driver, admin, company, ecommerce } = require('../config/contant');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    login_with: Joi.string().default('Auth'),
    password: Joi.string().custom(password).allow('', null).default('a12345678'),
    role: Joi.any().valid(normal, driver, admin, company, ecommerce).required(),
    fcm: Joi.string().default([]),
    email: Joi.string().required(),
    phone: Joi.string(),

    active: Joi.when('role', { is: company || ecommerce, then: Joi.string().default(0), otherwise: Joi.string().default(0) }),
    company: Joi.when('role', { is: driver, then: Joi.string().custom(objectId).required(), otherwise: Joi.string().custom(objectId) }),
    city: Joi.when('role', { is: company, then: Joi.string().custom(objectId).required(), otherwise: Joi.string() }),
    lat: Joi.when('role', { is: company, then: Joi.string().required(), otherwise: Joi.string().default('') }),
    lng: Joi.when('role', { is: company, then: Joi.string().required(), otherwise: Joi.string().default('') }),
    locationText: Joi.when('role', { is: company, then: Joi.string().required(), otherwise: Joi.string().default('') }),
    categories: Joi.when('role', { is: company, then: Joi.array().items(Joi.string().custom(objectId)).min(0), otherwise: Joi.array().items(Joi.string().custom(objectId)).default([]).min(0) }),
    permissions: Joi.when('role', { is: company, then: Joi.array().items(Joi.string().custom(objectId)).min(0), otherwise: Joi.array().items(Joi.string().custom(objectId)).default([]).min(0) }),




    categoryWithVechiles: Joi.when('role', {
      is: company, then:
        Joi.array().items({
          category: Joi.string().custom(objectId).required(),
          countOfVechiles: Joi.number().integer().default(0),
        }),
      otherwise: Joi.array().items({
        category: Joi.string().custom(objectId).required(),
        countOfVechiles: Joi.number().integer().default(0),
      }).min(0)
    }),



    website: Joi.when('role', { is: company, then: Joi.string().required(), otherwise: Joi.string() }),
    date_issue_licences: Joi.when('role', { is: company, then: Joi.date().required(), otherwise: Joi.string() }),
    date_expired_licences: Joi.when('role', { is: company, then: Joi.date().required(), otherwise: Joi.string() }),



    website: Joi.when('role', { is: ecommerce, then: Joi.string().required(), otherwise: Joi.string().default('') }),
    date_issue_licences: Joi.when('role', { is: ecommerce, then: Joi.date().required(), otherwise: Joi.string().default(null) }),
    date_expired_licences: Joi.when('role', { is: ecommerce, then: Joi.date().required(), otherwise: Joi.string().default(null) }),



  }),
};

const getUsers = {
  body: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    search: Joi.string().allow(''),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {

};

const updateFcm = {
  body: Joi.object().keys({
    fcm: Joi.string()
  }),
};




const updateUser = {
  body: Joi.object()
    .keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      login_with: Joi.string().default('Auth'),
      password: Joi.string().custom(password).allow('', null),
      phone: Joi.string(),
      email: Joi.string(),
      fcm: Joi.array().items(Joi.string()),
      createdAt: Joi.string(),
      active: Joi.number(),
      _id: Joi.string(),
      __v: Joi.number(),
      updatedAt: Joi.string(),



    })
    .min(1),
};

const updateUserUpdate = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      login_with: Joi.string().default('Auth'),
      role: Joi.any().valid(normal, driver, admin, company, ecommerce).required(),
      phone: Joi.string(),
      email: Joi.string(),
      password: Joi.string().custom(password).allow('', null),
      fcm: Joi.array().items(Joi.string()),
      createdAt: Joi.string(),
      active: Joi.number(),
      _id: Joi.string(),
      __v: Joi.number(),
      updatedAt: Joi.string(),



    })
    .min(1),
};



const updatePassword = {
  body: Joi.object()
    .keys({
      old_password: Joi.string().custom(password).required(),
      new_password: Joi.string().custom(password).required(),
    })
    .min(1),
};



const updateGuestPasswordAndActiveAccount = {
  body: Joi.object()
    .keys({
      new_password: Joi.string().custom(password).required(),
      user: Joi.string().custom(objectId).required(),
    })
    .min(1),
};



const AccpectOrRejectCompanyAccount = {
  body: Joi.object()
    .keys({
      active: Joi.number().required(),
      user: Joi.string().custom(objectId).required(),
    })
    .min(1),
};





const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};



const deleteUserPermission = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    permissionId: Joi.string().custom(objectId),
  }),
};


const createUserPermission = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    permissionId: Joi.string().custom(objectId),
  }),
};



module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateFcm,
  updatePassword,
  updateUserUpdate,
  deleteUserPermission,
  createUserPermission,
  updateGuestPasswordAndActiveAccount,
  AccpectOrRejectCompanyAccount
};
