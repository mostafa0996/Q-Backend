const express = require('express');
// const imageController = require('../../controllers/file.controller');
const router = express.Router();
const {nanoid: uniqueString} = require('nanoid');
var fs = require('fs');
const path = require('path');
var base64ToImage = require('base64-to-image')
const fspromise = require('fs').promises;
const auth = require('../../middlewares/auth');



//sharpe 
const multer = require("multer");
const MulterSharpResizer = require("../../../multer-sharp-resizer");
const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const i18next = require('i18next');
const { normal } = require('../../config/contant');
const User = require('../../models/user.model');
const { userService } = require('../../services');




var storage1 = multer.diskStorage({
    destination: async (req, file, cb) => {

        if (file.mimetype === 'image/gif') {
            cb(null, './images/');
        }
        if (file.mimetype === 'image/png') {
            cb(null, './images/');
        }
        if (file.mimetype === 'image/jpeg') {
            cb(null, './images/');
        }
        if (file.mimetype === 'application/pdf') {
            cb(null, './Documents/');
        }
        if (file.mimetype === 'text/plain') {
            cb(null, './images/');
        }
        if (file.mimetype === 'video/mp4') {
            cb(null, './Documents/');
        }


    },
    filename: async (req, file, cb) => {
        // console.log(file);
        var filename = uniqueString();

        if (file.mimetype === 'image/gif') {
            filename = filename + '.gif'
        }
        if (file.mimetype === 'image/png') {
            filename = filename + '.png'
        }
        if (file.mimetype === 'image/jpeg') {
            filename = filename + '.jpg'
        }

        if (file.mimetype === 'application/pdf') {
            filename = filename + '.pdf'
        }

        if (file.mimetype === 'text/plain') {
            filename = filename + '.txt'
        }

        if (file.mimetype === 'video/mp4') {
            filename = filename + '.mp4'
        }

        cb(null, filename);
    }
});



var upload_file = multer({ storage: storage1 });



const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(null, true);
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// Filter files with multer

const resizerImages = async (req, res, next) => {


    console.log(req.file);
    if (req.file.mimetype.startsWith("image")) {
        const filename = uniqueString();
        const sizes = [
            {
                path: "original",
                width: null,
                height: null,
                quality: 100
            },
            {
                path: "large",
                width: 800,
                height: 800,
                quality: 100
            },
            {
                path: "medium",
                width: 300,
                height: 300,
                quality: 100
            },
            {
                path: "thumbnail",
                width: 100,
                height: 100,
                quality: 100
            },
        ];
        const uploadPath = './public/uploads/';
        const fileUrl = `/uploads`;
        // sharp options
        const sharpOptions = {
            fit: 'cover',
            background: '#ffffffff',
        };

        // create a new instance of MulterSharpResizer and pass params
        const resizeObj = new MulterSharpResizer(
            req,
            filename,
            sizes,
            uploadPath,
            fileUrl,
            sharpOptions
        );


        // call resize method for resizing files
        await resizeObj.resize();
        const getDataUploaded = resizeObj.getData();
        res.send(getDataUploaded[0])

    } else {
        next(new ApiError(httpStatus.NOT_FOUND, i18next.t('INVALID_IMAGE')))
    }

};

const resizerImagesProfile = async (req, res, next) => {


    console.log(req.file);
    if (req.file.mimetype.startsWith("image")) {
        const filename = uniqueString();
        const sizes = [
            {
                path: "original",
                width: null,
                height: null,
                quality: 100
            },
            {
                path: "large",
                width: 800,
                height: 800,
                quality: 100
            },
            {
                path: "medium",
                width: 300,
                height: 300,
                quality: 100
            },
            {
                path: "thumbnail",
                width: 100,
                height: 100,
                quality: 100
            },
        ];
        const uploadPath = './public/uploads/';
        const fileUrl = `/uploads`;
        // sharp options
        const sharpOptions = {
            fit: 'cover',
            background: '#ffffffff',
        };

        // create a new instance of MulterSharpResizer and pass params
        const resizeObj = new MulterSharpResizer(
            req,
            filename,
            sizes,
            uploadPath,
            fileUrl,
            sharpOptions
        );


        // call resize method for resizing files
        await resizeObj.resize();
        const getDataUploaded = resizeObj.getData();

        var userUpdate = await userService.getUserById(req.user.id ? req.user.id : req.user._id);
        userUpdate.profile = getDataUploaded[0].originalname;
        userUpdate = await userService.updateUserById(req.user.id ? req.user.id : req.user._id, userUpdate, req);
        res.send(userUpdate)

    } else {
        next(new ApiError(httpStatus.NOT_FOUND, i18next.t('INVALID_IMAGE')))
    }

};
router
    .route('/image')
    .post(upload.single('file'), resizerImages);

router
    .route('/profile')
    .post(upload.single('profile'), auth(normal), resizerImagesProfile);

router.post('/base64/image', upload_file.single('base64'), async function (req, res, next) {

    var textFile = ''
    if (!req.file) {
        next(new ApiError(httpStatus.NOT_FOUND, i18next.t('INVALID_IMAGE')))
        return;
    }
    if (req.file.mimetype === 'text/plain') {

        var relative_ptah = './images/';
        relative_ptah = './images/';

        try {

            relative_ptah = './images/';
            textFile = relative_ptah + req.file.filename;
            var data = await fs.readFileSync(relative_ptah + req.file.filename, 'utf8');
            relative_ptah = './images/';

            var imagePath = path.resolve(relative_ptah);
            var optionalObj = { 'fileName': uniqueString() + '.png', 'type': 'png' };
            console.log({ imagePath, optionalObj })
            var imageInfo = await base64ToImage(data, imagePath + '/', optionalObj);


            setTimeout(() => {

                var images = {};
                relative_ptah = '/images/';
                images['url'] = relative_ptah + '/' + imageInfo.fileName;
                req.file = imageInfo;
                req.file.mimetype = 'image/png';
                console.log(req.file)


                fs.readFile(imagePath + '/' + imageInfo.fileName, async (err, data) => {
                    if (err) throw err; // Fail if the file can't be read.
                    let str = data.toString('base64')
                    data = Buffer.from(str, 'base64');
                    req.file.buffer = data;

                    const filename = uniqueString();
                    const sizes = [
                        {
                            path: "original",
                            width: null,
                            height: null,
                            quality: 100
                        },
                        {
                            path: "large",
                            width: 800,
                            height: 800,
                            quality: 100
                        },
                        {
                            path: "medium",
                            width: 300,
                            height: 300,
                            quality: 100
                        },
                        {
                            path: "thumbnail",
                            width: 100,
                            height: 100,
                            quality: 100
                        },
                    ];
                    const uploadPath = './public/uploads/';
                    const fileUrl = `/uploads`;
                    // sharp options
                    const sharpOptions = {
                        fit: 'cover',
                        background: '#ffffffff',
                    };

                    // create a new instance of MulterSharpResizer and pass params
                    const resizeObj = new MulterSharpResizer(
                        req,
                        filename,
                        sizes,
                        uploadPath,
                        fileUrl,
                        sharpOptions
                    );

                    // call resize method for resizing files
                    await resizeObj.resize();
                    const getDataUploaded = resizeObj.getData();
                    res.send(getDataUploaded[0]);
                    console.log(imagePath + '/' + imageInfo.fileName)
                    console.log(textFile)

                    await fspromise.unlink(imagePath + '/' + imageInfo.fileName);
                    await fspromise.unlink(textFile);
                });

            }, 1000);


        } catch (e) {
            console.log('Error:', e);
        }
    }



});

router.post('/mp4', upload_file.single('mp4'), async function (req, res, next) {

    if (!req.file) {
        next(new ApiError(httpStatus.NOT_FOUND, i18next.t('INVALID_VIDEO')))
        return;
    }
    if (req.file.mimetype === 'video/mp4') {
        filetype = 'mp4';
    }
    res.send({ url: '/video/' + req.file.filename });



});
router.post('/pdf', upload_file.single('pdf'), async function (req, res, next) {

    if (!req.file) {
        next(new ApiError(httpStatus.NOT_FOUND, i18next.t('INVALID_PDF')))
        return;
    }
    if (req.file.mimetype === 'application/pdf') {
        filetype = 'pdf';
    }
    res.send({ url: '/documents/' + req.file.filename });

});

// router.get('/get/:filename', imageController.getImage);
module.exports = router;
