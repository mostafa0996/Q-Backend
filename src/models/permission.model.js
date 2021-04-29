const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const Schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      default: '',
      required: false,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: false,
    },
    createdAt: {
      default: Date.now,
      type: Date,
    },
  }
);



Schema.plugin(toJSON);
Schema.plugin(paginate);

const Country = mongoose.model('permissions', Schema);

module.exports = Country;
