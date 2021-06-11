const httpStatus = require('http-status');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const twilio = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);





const sendOTP = async (phone, language) => {
  console.log(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)
  try {
    let verificationRequest = await twilio.verify.services(config.VERIFICATION_SID)
      .verifications
      .create({
        to:  '+201002192057', channel: 'sms', locale: language ? language : 'en',
        // customMessage: '*this code will be active for 10 minutes'
      });
    return verificationRequest;
  } catch (e) {
    if (e.status === 400) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid phone number');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, e.message);
    }

  }
}

const Verify = async (code, phone) => {
  console.log(code, phone)
  try {
    var verificationResult = await twilio.verify.services(config.VERIFICATION_SID)
      .verificationChecks
      .create({ code, to: '+201002192057'});
    if (verificationResult.status === 'approved') {
      return true;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Otp');
    }

  } catch (e) {
    console.log(e)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Otp');
  }
}



const sendSMSNotification = async (phone, message) => {
  try {
    console.log({
      body: message,
      from: '+201093993975',
      to: '201002192057',
    })
    twilio.messages
      .create({
        from: '+201093993975',
        body: message,
        to: '+201002192057'
      })
      .then(message => console.log(message.sid)).catch((error) => { console.log(error) });

  } catch (e) {
    console.log(e)
    if (e.status === 400) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid phone number');
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, e.message);
    }

  }
}

module.exports = {
  sendOTP,
  Verify,
  sendSMSNotification
};
