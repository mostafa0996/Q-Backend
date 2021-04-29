var admin = require("firebase-admin");

var serviceAccount = require('../config/deliveryq-8ccda-firebase-adminsdk-9ibou-41a3abbec3.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://deliveryq-8ccda.firebaseio.com"
});

const sendNotificaitonToSingleUser = async (body) => {
  admin.messaging().sendToDevice(body.token, { data: body.data, notification: body.notification }, { priority: 'high' })
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', JSON.stringify(response));
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
};




const sendAll = async (perms) => {
  var messageObj = {};
  messageObj.data = perms.data;
  messageObj.title = perms.title;
  messageObj.body = perms.body;
  messageObj.to = perms.fcm;
  messageObj.token = perms.fcm;
  messageObj.webpush = { headers: { Urgency: 'high' } };
  messageObj.notification = {
    title: perms.title, body: perms.body,
    click_action: 'link',
  };
  messageObj.android = {
    notification: {
      title: perms.title, body: perms.body,
    }
  };


  // console.log(messageObj)
  admin.messaging().sendToTopic(messageObj.token, { notification: messageObj.notification }, { priority: 'high' })
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', JSON.stringify(response));
      // console.log('Successfully sent message:', body);
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
};

const send = async (perms) => {


  var messageObj = {};
  messageObj.data = perms.data;
  messageObj.title = perms.title;
  messageObj.body = perms.description;
  messageObj.to = perms.fcm;
  messageObj.token = perms.fcm;
  messageObj.webpush = { headers: { Urgency: 'high' } };
  messageObj.notification = {
    title: perms.title, body: perms.description,
    click_action: 'link',
  };
  messageObj.android = {
    notification: {
      title: perms.title, body: perms.description,
    }
  };

  sendNotificaitonToSingleUser(messageObj);
};




module.exports = {
  sendNotificaitonToSingleUser,
  send,
  sendAll
};
