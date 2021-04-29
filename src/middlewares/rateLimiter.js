const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});

const formatNumberLength = (num) => {
  var r = "" + num;
  while (r.length < 10) {
    r = "0" + r;
  }
  return r;
}

module.exports = {
  authLimiter,
  formatNumberLength
};
