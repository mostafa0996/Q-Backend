const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const Schema = mongoose.Schema(
  {
    city: {
      type: mongoose.Schema.ObjectId,
      ref: 'City',
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    apartment: {
      type: String,
      required: false,
    },
    additional: {
      type: String,
      default: '',
      required: false,
    },
    street: {
      type: String,
      default: '',
      required: false,
    },
    building: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
    locationText: {
      type: String,
      required: true,
    },
    createdAt: {
      default: Date.now,
      type: Date,
    },
  }
);





Schema.plugin(toJSON);
Schema.plugin(paginate);



const Country = mongoose.model('address', Schema);

module.exports = Country;
