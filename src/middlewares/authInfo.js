const httpStatus = require('http-status');
const passport = require('passport');
const ApiError = require('../utils/ApiError');
const InfoCallback = (req, resolve, reject) => async (err, user, info) => {
  req.user = user;
    if ((err || info || !user) && req.headers.authorization && req.headers.authorization !== '') {
    // return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    resolve();
  }
  resolve();
};


const authInfo = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, InfoCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = authInfo;
