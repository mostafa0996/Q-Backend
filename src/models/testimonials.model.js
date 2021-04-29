const mongoose = require('mongoose');
const { toJSON, paginate_testimonials } = require('./plugins');

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
Schema.plugin(paginate_testimonials);



const Category = mongoose.model('testimonials', Schema);

module.exports = Category;
