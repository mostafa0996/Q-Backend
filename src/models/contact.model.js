const mongoose = require('mongoose');
const { toJSON, paginate_request } = require('./plugins');


const Schema = mongoose.Schema(
  {
    companyname: {
      type: String,
      trim: true,
    },
    type: {
      type: Number,
      trim: true,
      default: 1,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    numberofvehicles: {
      type: Number,
      default: 0,
    },
    ordersperday: {
      type: Number,
      default: 0,
    },
    city: {
      type: mongoose.Schema.ObjectId,
      ref: 'City',
      required: false,
    },
    createdAt: {
      default: Date.now,
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
Schema.plugin(toJSON);
Schema.plugin(paginate_request);
const Post = mongoose.model('Contact', Schema);

module.exports = Post;
