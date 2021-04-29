const mongoose = require('mongoose');
const { companyOrIndividual } = require('../config/roles');
const { toJSON, paginate_request } = require('./plugins');


const Schema = mongoose.Schema(
  {
    
    type: {
      type: Number,
      trim: true,
      enum: companyOrIndividual,
      default: companyOrIndividual[0],
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
    details: {
      type: String,
      default: '',
    },
    status: {
      type: Number,
      default: 0,
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
const Post = mongoose.model('Request', Schema);

module.exports = Post;
