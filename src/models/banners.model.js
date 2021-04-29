const mongoose = require('mongoose');
const { toJSON, paginate_banners } = require('./plugins');

const Schema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    active: {
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
Schema.plugin(paginate_banners);



const Category = mongoose.model('Banners', Schema);

module.exports = Category;
