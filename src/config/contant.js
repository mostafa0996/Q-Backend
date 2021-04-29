
const i18next = require('i18next');
module.exports = {

  master: 'master',
  normal: 'user',
  company: 'company',
  ecommerce: 'ecommerce',
  admin: 'admin',
  driver: 'driver',
  response(code, message, data) {
    return {
      code: code,
      data: data,
      message: i18next.t(message),
    }
  },
};
