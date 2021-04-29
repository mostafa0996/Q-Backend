

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const Schema = mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
    },
    unsubscriber: {
      type: Number,
      default: 0,
    },
    createdAt: {
      default: Date.now,
      type: Date,
    },
  }
);

// add plugin that converts mongoose to json
Schema.plugin(toJSON);
Schema.plugin(paginate);



const Type = mongoose.model('Subscriber', Schema);
module.exports = Type;
