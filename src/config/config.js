const dotenv = require('dotenv');
const path = require('path');
const Joi = require('@hapi/joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(6000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('DeliveryQ'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(11114400).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(1110).description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),

    SMTP_USERNAME_INFO: Joi.string().description('username for email server'),
    SMTP_PASSWORD_INFO: Joi.string().description('password for email server'),
    EMAIL_FROM_INFO: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {


  TWILIO_ACCOUNT_SID: envVars.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: envVars.TWILIO_AUTH_TOKEN,
  VERIFICATION_SID: envVars.VERIFICATION_SID,
  WEBSITE: envVars.WEBSITE,
  DASHBOARD: envVars.DASHBOARD,





  env: envVars.NODE_ENV,
  port: envVars.PORT,
  porthttp: envVars.PORTHTTP,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      service: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },

  emailInfo: {
    smtp: {
      host: envVars.SMTP_HOST,
      service: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME_INFO,
        pass: envVars.SMTP_PASSWORD_INFO,
      },
    },
    from: envVars.EMAIL_FROM_INFO,
  },
};
