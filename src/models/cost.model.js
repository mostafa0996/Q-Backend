const mongoose = require('mongoose');
const { toJSON, paginate_cost } = require('./plugins');

const Schema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'City',
      required: true,
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: 'City',
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Categories',
      required: true,
    },
    cost: {
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
Schema.plugin(paginate_cost);



const Type = mongoose.model('Cost', Schema);
module.exports = Type;
