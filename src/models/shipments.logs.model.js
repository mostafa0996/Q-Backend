const mongoose = require('mongoose');
const { toJSON, paginate_shipments } = require('./plugins');


const Schema = mongoose.Schema(
  {
    shipment: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    distance: {
      type: Number,
      default: 0,
      required: true,
    },
    rejectedReason: {
      type: String,
      default: '',
    },
    time: {
      default: Date.now,
      type: Date,
    },
    status: {
      type: Number,
      default: 0,
      required: true,
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
Schema.plugin(paginate_shipments);
const Post = mongoose.model('ShipmentsLogs', Schema);

module.exports = Post;
