const mongoose = require('mongoose');
const { toJSON, paginate_homeContent } = require('./plugins');

const Schema = mongoose.Schema(
  {
    description_ar: {
      type: String,
      required: true,
    },
    description_en: {
      type: String,
      required: true,
    },
    title_ar: {
      type: String,
      required: true,
    },
    title_en: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
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
Schema.plugin(paginate_homeContent);



const Category = mongoose.model('homeContent', Schema);

module.exports = Category;
