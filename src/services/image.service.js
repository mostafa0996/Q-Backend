const { File } = require('../models');

const uplaod = async (req) => {
  let newImage = new File({
    caption: req.file.contentType,
    filename: req.file.filename,
    fileId: req.file.id,
  });

  let image = await newImage.save();
  return image;
};

module.exports = {
  uplaod
};
