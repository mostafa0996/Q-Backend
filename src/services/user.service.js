const httpStatus = require('http-status');
const { User } = require('../models');
const mongoose = require("mongoose");
const ApiError = require('../utils/ApiError');
const twilloService = require('./twillo.service');
const { normal } = require('../config/contant');


const createUser = async (userBody) => {

  userBody.loc = [userBody.lat, userBody.lng];
  if (userBody.email) {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken', true);
    }
  }


  if (await User.isPhoneTaken(userBody.phone)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
  }
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const user = await User.create(userBody);
  return user;
};


const createUserGuest = async (userBody) => {

  var user = await getUserByEmail(userBody.email, normal);
  if (user) {
    return user;
  } else {
    userBody.loc = [userBody.lat, userBody.lng];
    userBody.guest = 1;
    const user = await User.create(userBody);
    return user;
  }
};



const checkUserExistWithDetails = async (Body, req) => {

  if (await User.isPhoneTaken(Body.phone, Body.app, req.body.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
  }
  if (await User.isEmailTaken(Body.email, Body.app, req.body.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = false
  return user;

};


const checkUserWithDetails = async (Body, req) => {

  if (!await User.isPhoneTaken(Body.phone, Body.app, req.body.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
  }
  const user = false
  return user;
};




const createUserSocial = async (userBody, req) => {
  userBody.password = 'a12345678';
  if (await User.isEmailTaken(userBody.email)) {
    const user = await getUserByEmail(userBody.email);
    delete userBody.password;
    const updated = await updateUserById(user._id, userBody, req);
    return updated;
  } else {
    const user = await User.create(userBody);
    return user;
  }
};



const queryUsers = async (filter, options, keywords) => {
  const users = await User.paginate(filter, options, keywords);
  return users;
};


const queryUsersCountShipments = async (filter, options, keywords) => {
  const users = await User.queryUsersCountShipments(filter, options, keywords);
  return users;
};




const queryUsersByDistance = async (filter, options, keywords, location) => {
  const users = await User.paginatebyDisctance(filter, options, keywords, location);
  return users;
};

const getUserById = async (id) => {
  return User.findById(id);
};




const getUserByIdDetails = async (id, req) => {
  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      '$lookup': {
        from: 'cities',
        let: { country_id: "$city" },
        as: 'cityObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$country_id"] } }, },
          { $project: { title: '$' + 'title_' + req.headers['accept-language'] ? '$' + 'title_' + req.headers['accept-language'] : '$' + multilanguageValues + 'en', image: '$image' } },
        ],
      }
    }, {
      $unwind: {
        path: '$cityObj',
        preserveNullAndEmptyArrays: true,
      }
    }, {
      $unwind: {
        path: '$categories',
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      '$lookup': {
        from: 'categories',
        let: { category: "$categories" },
        as: 'categoryObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$category"] } }, },
          { $project: { title: '$' + 'title_' + req.headers['accept-language'] ? '$' + 'title_' + req.headers['accept-language'] : '$' + multilanguageValues + 'en', image: '$image' } },
        ],
      }
    },
    {
      $unwind: {
        path: '$categoryObj',
        preserveNullAndEmptyArrays: true,
      }
    },






    {
      "$group": {
        "_id": "$_id",
        "categories": { "$push": "$categoryObj" },
        "first_name": { "$first": "$first_name" },
        "cityObj": { "$first": "$cityObj" },
        "last_name": { "$first": "$last_name" },
        "categoryWithVechiles": { "$first": "$categoryWithVechiles" },
        "phone": { "$first": "$phone" },
        "role": { "$first": "$role" },
        "fcm": { "$first": "$fcm" },
        "active": { "$first": "$active" },
        "trade_licence": { "$first": "$trade_licence" },
        "company_name": { "$first": "$company_name" },
        "area": { "$first": "$area" },
        "createdAt": { "$first": "$createdAt" },
        "permissions": { "$first": "$permissions" },
        "email": { "$first": "$email" },
        "guest": { "$first": "$guest" },
        "lat": { "$first": "$lat" },
        "profile": { "$first": "$profile" },
        "lng": { "$first": "$lng" },
        "city": { "$first": "$city" },
        "website": { "$first": "$website" },
        "designation": { "$first": "$designation" },
        "date_issue_licences": { "$first": "$date_issue_licences" },
        "date_expired_licences": { "$first": "$date_expired_licences" },
        "locationText": { "$first": "$locationText" },
      },
    },  //start new categegories with number of vechiles
    {
      $unwind: {
        path: '$categoryWithVechiles',
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      '$lookup': {
        from: 'categories',
        let: { category: "$categoryWithVechiles.category" },
        as: 'categoryWithVechiles.categoryObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$category"] } }, },
          { $project: { title: '$' + 'title_' + req.headers['accept-language'] ? '$' + 'title_' + req.headers['accept-language'] : '$' + multilanguageValues + 'en', image: '$image' } },
        ],
      }
    },
    {
      $unwind: {
        path: '$categoryWithVechiles.categoryObj',
        preserveNullAndEmptyArrays: true,
      }
    },

    //end


    {
      "$group": {
        "_id": "$_id",
        "categoryWithVechiles": { "$push": "$categoryWithVechiles" },
        "first_name": { "$first": "$first_name" },
        "categories": { "$first": "$categories" },
        "cityObj": { "$first": "$cityObj" },
        "last_name": { "$first": "$last_name" },
        "phone": { "$first": "$phone" },
        "role": { "$first": "$role" },
        "fcm": { "$first": "$fcm" },
        "permissions": { "$first": "$permissions" },
        "active": { "$first": "$active" },
        "trade_licence": { "$first": "$trade_licence" },
        "company_name": { "$first": "$company_name" },
        "area": { "$first": "$area" },
        "createdAt": { "$first": "$createdAt" },
        "lat": { "$first": "$lat" },
        "lng": { "$first": "$lng" },
        "email": { "$first": "$email" },
        "profile": { "$first": "$profile" },
        "guest": { "$first": "$guest" },
        "city": { "$first": "$city" },
        "website": { "$first": "$website" },
        "designation": { "$first": "$designation" },
        "date_issue_licences": { "$first": "$date_issue_licences" },
        "date_expired_licences": { "$first": "$date_expired_licences" },
        "locationText": { "$first": "$locationText" },
      }
    }
    , {
      $unwind: {
        path: '$permissions',
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      '$lookup': {
        from: 'permissions',
        let: { permissions: "$permissions" },
        as: 'permissions',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$permissions"] } }, },
        ],
      }
    },
    {
      $unwind: {
        path: '$permissions',
        preserveNullAndEmptyArrays: true,
      }
    },
    {
      "$group": {
        "_id": "$_id",
        "permissions": { "$push": "$permissions" },
        "first_name": { "$first": "$first_name" },
        "categories": { "$first": "$categories" },
        "cityObj": { "$first": "$cityObj" },
        "last_name": { "$first": "$last_name" },
        "phone": { "$first": "$phone" },
        "role": { "$first": "$role" },
        "fcm": { "$first": "$fcm" },
        "categoryWithVechiles": { "$first": "$categoryWithVechiles" },
        "active": { "$first": "$active" },
        "trade_licence": { "$first": "$trade_licence" },
        "company_name": { "$first": "$company_name" },
        "area": { "$first": "$area" },
        "createdAt": { "$first": "$createdAt" },
        "lat": { "$first": "$lat" },
        "lng": { "$first": "$lng" },
        "email": { "$first": "$email" },
        "guest": { "$first": "$guest" },
        "city": { "$first": "$city" },
        "profile": { "$first": "$profile" },
        "website": { "$first": "$website" },
        "designation": { "$first": "$designation" },
        "date_issue_licences": { "$first": "$date_issue_licences" },
        "date_expired_licences": { "$first": "$date_expired_licences" },
        "locationText": { "$first": "$locationText" },
      }
    }





  ]);
  return user[0];

};



const getUserByIdSimple = async (id) => {
  return User.findById(id);
};


const getUserByEmail = async (email, role) => {
  return User.findOne({ email, role });
};

const getUserByEmailWithoutRole = async (email) => {
  return User.findOne({ email });
};

const getUserByEmailAdmins = async (email) => {
  return User.findOne({ email });
};
const getUserByEmailAndActive = async (email) => {
  return User.findOne({ email, active: 1 });
};

const getUserByPhone = async (phone) => {
  return User.findOne({ phone });
};



const updateUserById = async (userId, updateBody, req) => {




  var removeDuplicateFcm = [];
  if (updateBody.fcm) {
    updateBody.fcm.forEach(function (item) {
      if (removeDuplicateFcm.indexOf(item) < 0) {
        removeDuplicateFcm.push(item);
      }
    });
    updateBody.fcm = removeDuplicateFcm;
  }

  var user = await getUserById(userId);

  if (user.phone !== updateBody.phone) {
    await twilloService.Verify(updateBody.otp, updateBody.phone);
  }


  if (await User.isPhoneTaken(updateBody.phone, userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
  }
  if (await User.isEmailTaken(updateBody.email, userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  Object.assign(user, updateBody);
  await user.save();
  user = await getUserByIdDetails(userId, req);
  return user;
};

const updateUserByIdSimple = async (userId, updateBody) => {


  const user = await getUserByIdSimple(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};


const updateFcm = async (userId, fcm) => {
  return await User.findByIdAndUpdate(userId, { $addToSet: { fcm: fcm } });
};
const getFcm = async (userId, fcm) => {
  return await User.findById(userId, { fcm: 1, });
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, ('DATA_NOT_FOUND'));
  }
  await user.remove();
  return user;
};








module.exports = {
  createUser,
  createUserSocial,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUserById,
  deleteUserById,
  updateFcm,
  getFcm,
  getUserByEmailAndActive,
  getUserByIdSimple,
  updateUserByIdSimple,
  getUserByIdDetails,
  checkUserExistWithDetails,
  checkUserWithDetails,
  queryUsersByDistance,
  createUserGuest,
  queryUsersCountShipments,
  getUserByEmailAdmins,
  getUserByEmailWithoutRole
};
