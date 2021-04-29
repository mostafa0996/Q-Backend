const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { contactService } = require('../services');
const i18next = require('i18next');
const ApiError = require('../utils/ApiError');
const { response } = require('../config/contant');
const infoService = require('../services/info.service');



const createContact = catchAsync(async (req, res) => {
  delete req.body._id;
  const object = await contactService.createContact(req.body);
  res.send(response(httpStatus.OK, i18next.t('Thanks for contacting us we will be in touch with you shortly.'), object));
  infoService.sendEmail('enquiry@deliverq.com', 'DeliverQ Request', '<h2>Hi DeliverQ!</h2> <p style="font-size: 1.5em;">You have new Query request from ' + req.body.name + ' .</p> <p style="font-size: 1.5em;"><strong>City: </strong> ' + object.city.title_en + '</p>  <p style="font-size: 1.5em;"><strong>Email: </strong> ' + req.body.email + '</p>   <p style="font-size: 1.5em;"><strong>Phone: </strong> ' + req.body.phone + '</p>  <p style="font-size: 1.5em;"><strong>Vechiles: </strong> ' + req.body.numberofvehicles + '</p>   <p style="font-size: 1.5em;"><strong>Order per day: </strong> ' + req.body.ordersperday + '</p>   <p style="font-size: 1.5em;"><strong>Company: </strong> ' + req.body.companyname + '</p> <p style="font-size: 1.5em;">Thanks ,</p>')
});


const getContacts = catchAsync(async (req, res) => {


  const filter = pick(req.query, ['status', 'keyword', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  var filters = [];
  if (filter.keyword) {
    filters.push({ name: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
    filters.push({ company: { $regex: '.*' + filter.keyword + '.*', $options: 'i' } })
  }
  if (filter.type) {
    filters.push({ type: filter.type })
  }

  const result = await contactService.queryContacts(filters, options, req);
  res.send(result);
});


const getContact = catchAsync(async (req, res) => {
  const Contact = await contactService.getContactById(req.params.id);
  if (!Contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'DATA_NOT_FOUND');
  }
  res.send(Contact);
});

const updateContact = catchAsync(async (req, res) => {
  const Contact = await contactService.updateContactById(req.params.id, req.body, req);
  res.send(Contact);
});

const deleteContact = catchAsync(async (req, res) => {
  const Contact = await contactService.deleteContactById(req.params.id);
  res.send(Contact);
});



module.exports = {
  createContact,
  getContacts,
  deleteContact,
  updateContact,
  getContact
};
