const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoriesRoute = require('./categories.route');
const categoriesSubRoute = require('./categories.sub.route');
const typesRoute = require('./type.route');
const cityRoute = require('./city.route');
const advantageRoute = require('./advantage.route');

const addressRoute = require('./address.route');

const requestRoute = require('./request.route');
const shipmentsRoute = require('./shipments.route');

const fileRoute = require('./file.route');
const homeRoute = require('./deliveryQ.route');
const bannersRoute = require('./banners.route');
const notificaitonsRoute = require('./notification.route');
const docsRoute = require('./docs.route');
const costRoute = require('./cost.route');
const contactRoute = require('./contact.route');
const subscribersRoute = require('./subscribers.route');
const permissionRoute = require('./permission.route');
const contentRoute = require('./content.route');
const counterRoute = require('./conter.route');
const testimonialsRoute = require('./testimonials.route');
const partnersRoute = require('./partners.route');
const homeContentRoute = require('./homeContent.route');








const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/category', categoriesRoute);
router.use('/sub/category', categoriesSubRoute);
router.use('/type', typesRoute);
router.use('/city', cityRoute);
router.use('/cost', costRoute);
router.use('/advantage', advantageRoute);
router.use('/address', addressRoute);
router.use('/request', requestRoute);
router.use('/shipments', shipmentsRoute);
router.use('/file', fileRoute);
router.use('/banners', bannersRoute);
router.use('/notificaitons', notificaitonsRoute);
router.use('/contact', contactRoute);
router.use('/subscribers', subscribersRoute);
router.use('/permission', permissionRoute);
router.use('/content', contentRoute);
router.use('/counter', counterRoute);
router.use('/testimonials', testimonialsRoute);
router.use('/partners', partnersRoute);
router.use('/homeContent', homeContentRoute);







router.use('/deliveryQ', homeRoute);

router.use('/docs', docsRoute);



module.exports = router;
