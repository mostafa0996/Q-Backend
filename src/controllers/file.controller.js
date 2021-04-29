const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { imageService } = require('../services');

const mongoose = require('mongoose');
const config = require('../config/config');


console.log(config.mongoose.url)
const connect = mongoose.createConnection(config.mongoose.url, { useNewUrlParser: true, useUnifiedTopology: true });
let gfs;
connect.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "uploads"
  });
});

const getImage = catchAsync(async (req, res) => {

  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No files available',
      });
    }

    if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
      // render image to browser
      var readstream = gfs.openDownloadStreamByName(req.params.filename);
      res.set('Content-Type', files[0].contentType)
      return readstream.pipe(res);
    } else {
      var readstream = gfs.openDownloadStreamByName(req.params.filename);
      res.set('Content-Type', files[0].contentType)
      return readstream.pipe(res);

    }
  });


});

const uplaod = catchAsync(async (req, res) => {
  const image = await imageService.uplaod(req);
  res.status(httpStatus.CREATED).send(image);
});


module.exports = {
  getImage,
  uplaod
};
