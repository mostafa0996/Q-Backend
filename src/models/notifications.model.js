const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const Schema = mongoose.Schema(
  {
    title_en: {
      type: String,
      required: true,
    },
    title_ar: {
      type: String,
      required: true,
    },
    description_en: {
      type: String,
      required: true,
    },
    description_ar: {
      type: String,
      required: true,
    },
    read: {
      type: Number,
      default: 0,
    },
    actionurl: {
      type: String,
      required: false,

    },
    actionData: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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



const Type = mongoose.model('Notifications', Schema);
module.exports = Type;
