const winston = require('winston');

function Logger () {
  this.logger = new (winston.Logger)({
    transports: [
      new winston.transports.File({
        filename: 'app.log',
        timestamp: true
      }),
      new (winston.transports.Console)({
        colorize: true,
        timestamp: () => {
          return Date.now();
        },
      }),
    ],
  });
}

Logger.prototype = {
  /**
   * It will log the message on console
   * @param message
   */
  log: function log (message) {
    this.logger.info(message);
  },
}
;

module.exports = Logger;
