const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');


const app = express();


// enable cors
app.use(cors());
app.options('*', cors());



app.use("/uploads", express.static("./public/uploads/", { fallthrough: false }));
app.use("/video", express.static("./Documents/", { fallthrough: false }));
app.use("/documents", express.static("./Documents/", { fallthrough: false }));
app.use("/v1/auth/forgot-password/img", express.static("./rest-password-assets/img", { fallthrough: false }));
app.use("/v1/auth/forgot-password/js", express.static("./rest-password-assets/js", { fallthrough: false }));
app.use("/v1/auth/forgot-password/css", express.static("./rest-password-assets/css", { fallthrough: false }));


app.use("/v1/auth/register/img", express.static("./rest-password-assets/img", { fallthrough: false }));
app.use("/v1/auth/register/js", express.static("./rest-password-assets/js", { fallthrough: false }));
app.use("/v1/auth/register/css", express.static("./rest-password-assets/css", { fallthrough: false }));

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}



//language 

const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
var fs = require('fs');



i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(Backend)
  .init({
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      allowMultiLoading: true,
    },
    debug: false,
    preload: ['en', 'ar'],
    saveMissing: true,
    saveMissingTo: "current",
    fallbackLng: 'en',

  });
i18next.on('missingKey', function (lngs, namespace, key, res) {

  // add missing languages key for differance platforms :-) good job muhammmad lol

  var keysOpt = JSON.parse(fs.readFileSync(__dirname + '/locales/ar/translation.json'));
  keysOpt[key] = key;
  fs.writeFileSync(__dirname + '/locales/ar/translation.json', JSON.stringify(keysOpt, null, ' '));

  var keysOpt = JSON.parse(fs.readFileSync(__dirname + '/locales/dev/translation.json'));
  keysOpt[key] = key;
  fs.writeFileSync(__dirname + '/locales/dev/translation.json', JSON.stringify(keysOpt, null, ' '));

  var keysOpt = JSON.parse(fs.readFileSync(__dirname + '/locales/en/translation.json'));
  keysOpt[key] = key;
  fs.writeFileSync(__dirname + '/locales/en/translation.json', JSON.stringify(keysOpt, null, ' '));
});

app.use(i18nextMiddleware.handle(i18next));

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());


// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, i18next.t('DATA_NOT_FOUND')));
});


// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);


module.exports = app;
