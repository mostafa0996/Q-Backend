const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const Schema = mongoose.Schema(
  {

    image: {
      type: String,
      required: true,
    },
    title_ar: {
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
    description_ar: {
      type: String,
      required: true,
    },
    description_en: {
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



const Type = mongoose.model('Advantage', Schema);
module.exports = Type;
