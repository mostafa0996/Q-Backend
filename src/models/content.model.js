const mongoose = require('mongoose');
const { toJSON, paginate_content } = require('./plugins');

const Schema = mongoose.Schema(
  {
    content_ar: {
      type: String,
      required: true,
    },
    content_en: {
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
    image: {
      type: String,
      default: '',
    },
    cover: {
      type: String,
      default: '',
    },
    type: {
      type: Number,
      default: 1,
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



const Category = mongoose.model('contemt', Schema);

module.exports = Category;
