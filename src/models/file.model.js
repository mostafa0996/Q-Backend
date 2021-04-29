const mongoose = require('mongoose');
const Schema = mongoose.Schema(
  {
    caption: {
      required: true,
      type: String,
    },
    filename: {
      required: true,
      type: String,
    },
    fileId: {
      required: true,
      type: String,
    },
    createdAt: {
      default: Date.now,
      type: Date,
    },
  }
);


const File = mongoose.model('File', Schema);

module.exports = File;
