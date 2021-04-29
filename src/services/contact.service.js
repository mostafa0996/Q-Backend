const httpStatus = require('http-status');
const i18next = require('i18next');
const { Contact } = require('../models');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const mongoose = require("mongoose");


const createContact = async (userBody) => {
  const object = await (await Contact.create(userBody)).populate('city').execPopulate();
  return object;
};

const queryContacts = async (filter, options, req) => {
  const object = await Contact.contact(filter, options, req);
  return object;
};



const getContactById = async (id) => {
  return (await Contact.findById(id));
};

const updateContactById = async (ContactId, updateBody, req) => {
  console.log(ContactId)
  const object = await getContactById(ContactId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  Object.assign(object, updateBody);
  await object.save();

  req.query._id = ContactId;
  const filter = pick(req.query, ['_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter._id) {
    filters.push({ _id: new mongoose.Types.ObjectId(filter._id) })
  }

  const objectlist = await Contact.paginate(filters, options, req);
  return objectlist.results[0];
};

const deleteContactById = async (ContactId) => {
  const object = await getContactById(ContactId);
  if (!object) {
    throw new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND'));
  }
  await object.remove();
  return {
    code: httpStatus.OK,
    message: i18next.t('Success')
  };
};




module.exports = {
  createContact,
  queryContacts,
  getContactById,
  updateContactById,
  deleteContactById
}
