const { normal, admin, driver, company, ecommerce, master } = require("./contant");

const roles = [normal, admin, master, driver, company, ecommerce];
const roleRights = new Map();
roleRights.set(roles[0], [normal]);
roleRights.set(roles[1], [normal, driver, admin, company, ecommerce]);
roleRights.set(roles[2], [normal, driver, admin, company, ecommerce, master]);
roleRights.set(roles[3], [normal, driver, admin]);
roleRights.set(roles[4], [normal, driver, admin, company]);
roleRights.set(roles[5], [normal, driver, admin, company, ecommerce]);



const authEnum = ['Auth', 'Facebook', 'Google'];
const genderEnum = ['none', 'male', 'femlae'];
const companyOrIndividual = [1, 2, 3];
const requestTypeEnum = ['0', '1', '2', '3', '4'];
const requestAdTypeEnum = ['1', '2'];
const requestPostStoryEnum = ['1', '2'];
const requestHourTypeEnum = ['1', '2'];




module.exports = {
  roles,
  roleRights,
  authEnum,
  genderEnum,
  companyOrIndividual,
  requestTypeEnum,
  requestAdTypeEnum,
  requestPostStoryEnum,
  requestHourTypeEnum
};
