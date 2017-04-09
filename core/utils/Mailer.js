const nodemailer = require('nodemailer');

function Mailer () {
  this.smtpConfig = {
    host: process.env.MAIL_SERVER,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  };
  this.transporter = nodemailer.createTransport(this.smtpConfig);
}

Mailer.prototype = {

  sendEmail: function sendEmail (params) {
    let mailOptions = {
      from: `<${process.env.MAIL_USER}>`,
      to: params.username,
      subject: 'Confirmation quote',
      text: `Dear ${params.name},
            We confirm that you have bought an insurance contract for your ${params.car} which value is
            ${params.value}.
            The price to be paid is ${params.price}.
            Best regards,
            QOVER`,
    };
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        }
        resolve(info);
      });
    });
  },
}
;

module.exports = Mailer;
