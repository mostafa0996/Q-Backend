const mongoose = require('mongoose');
const { toJSON, paginate_partners } = require('./plugins');

const Schema = mongoose.Schema(
  {
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
Schema.plugin(paginate_partners);



const Category = mongoose.model('partner', Schema);

module.exports = Category;
