const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const fs = require('fs');

let server;


const options = {
  key: fs.readFileSync("./server-deliverq.com/server.key", 'utf8'),
  cert: fs.readFileSync("./server-deliverq.com/36d54e43a3fc4be0.crt", 'utf8'),
  ca: fs.readFileSync('./server-deliverq.com/gd_bundle-g2-g1.crt', 'utf8'),
};

httpsserver = require("https").createServer(options, app);


mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = httpsserver.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
  server = app.listen(config.porthttp, () => {
    logger.info(`Listening to port ${config.porthttp}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
