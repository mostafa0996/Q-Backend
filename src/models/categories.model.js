const mongoose = require('mongoose');
const { toJSON, paginate_categories } = require('./plugins');

const Schema = mongoose.Schema(
  {
    icon: {
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
    active: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    price: {
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
Schema.plugin(paginate_categories);



const Category = mongoose.model('Categories', Schema);

module.exports = Category;
