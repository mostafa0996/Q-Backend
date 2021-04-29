const mongoose = require('mongoose');
const { toJSON, paginate_categories_news } = require('./plugins');

const Schema = mongoose.Schema(
  {
    icon: {
      type: String,
      required: false,
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

    note_ar: {
      type: String,
      required: false,
    },
    note_en: {
      type: String,
      required: false,
    },

    other: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Categories',
      required: true
    },
    createdAt: {
      default: Date.now,
      type: Date,
    },
  }
);




// add plugin that converts mongoose to json
Schema.plugin(toJSON);
Schema.plugin(paginate_categories_news);



const Category = mongoose.model('categoriesSub', Schema);

module.exports = Category;
