const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const emailService = require('./email.service');


const loginUserWithEmailAndPassword = async (email, password, role) => {
  var user = await userService.getUserByEmail(email, role);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'incorrect email or password');
  }
  var user = await userService.getUserByEmailAndActive(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'your account is not active please check your email to active your account or contact with our support.');
  }
  return user;
};


const loginUserWithEmailAndPasswordAdmins = async (email, password) => {
  var user = await userService.getUserByEmailAdmins(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'incorrect email or password');
  }
  var user = await userService.getUserByEmailAndActive(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'your account is not active please check your email to active your account or contact with our support.');
  }
  return user;
};




const checkUserWithEmailAndPassword = async (email, password, req) => {
  var user = await userService.getUserByEmail(email, req.user.role);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'invalid old passsword');
  }
  return user;
};



const changePassword = async (userId, newPassword) => {
  console.log('newPassword', newPassword)
  try {
    await userService.updateUserByIdSimple(userId, { password: newPassword });
  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};


/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};


const resetPassword = async (resetPasswordToken, newPassword, req) => {

  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, 'resetPassword');
    const user = await userService.getUserByIdSimple(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user._id, type: 'resetPassword' });
    await userService.updateUserByIdSimple(user._id, { password: newPassword }, req);
  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};




const active = async (verificationToken) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(verificationToken, 'verification');
    const user = await userService.getUserByIdSimple(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserByIdSimple(user._id, { active: 1 });
    await Token.deleteMany({ user: user._id, type: 'verification' });

  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'email verificaiton failed please resend verification mail again');
  }
};

const verification = async (email, url) => {
  try {
    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new Error();
    }
    if (user.active === 1) {
      throw new Error();
    } else {
      const verificationToken = await tokenService.generateTokenForverification(email);
      await emailService.sendEmailverification(user.email, verificationToken, url);
    }

  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'email verificaiton failed please resend verification mail again user not found or already verified');
  }
};





/**
 * Reset password
 */
const profile = async (user_id) => {
  try {
    console.log('user_id', user_id);
    const user = await userService.getUserById(user_id);
    if (!user) {
      throw new Error();
    }
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  refreshAuth,
  resetPassword,
  profile,
  active,
  verification,
  changePassword,
  checkUserWithEmailAndPassword,
  loginUserWithEmailAndPasswordAdmins
};
