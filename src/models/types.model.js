const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const Schema = mongoose.Schema(
  {
    duration: {
      type: String,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
    title_en: {
      type: String,
      required: true,
    },
    title_ar: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
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

const Type = mongoose.model('Type', Schema);
module.exports = Type;
