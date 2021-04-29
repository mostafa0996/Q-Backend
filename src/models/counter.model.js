const mongoose = require('mongoose');
const { toJSON, paginate_content } = require('./plugins');

const Schema = mongoose.Schema(
  {
    title_ar: {
      type: String,
      required: true,
    },
    title_en: {
      type: String,
      required: true,
    },
    value: {
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
Schema.plugin(paginate_content);



const Category = mongoose.model('counter', Schema);

module.exports = Category;
