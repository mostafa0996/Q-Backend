const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const Schema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['refresh', 'resetPassword','verification'],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
Schema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', Schema);

module.exports = Token;
