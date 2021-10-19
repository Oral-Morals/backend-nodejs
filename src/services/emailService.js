const nodemailer = require("nodemailer");

let transporter;

if (process.env.MAILTRAP === "true") {
  // Use this for Mailtrap for development.
  transporter = nodemailer.createTransport({
    port: process.env.DEV_MAIL_PORT,
    host: process.env.DEV_MAIL_HOST,
    auth: {
      user: process.env.DEV_MAIL_USERNAME,
      pass: process.env.DEV_MAIL_PASSWORD,
    },
    // secure: true,
  });
} else {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    secure: true,
  });
}

exports.sendMail = async (mailOptions = {}) => {
  try {
    const mailData = {
      from: process.env.SENDER_ADDRESS,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    // console.log({ mailOptions, mailData });

    if (process.env.SEND_EMAILS === "true") {
      transporter.sendMail(mailData, (info) => {
        console.log({ message: "Mail sent", message_id: info.message });
      });
    } else {
      console.log("Email not sent!");
      console.log(
        `If you want to send an email, set the environment variable "SEND_EMAILS" to true and restart the server.`
      );
    }
  } catch (error) {
    console.log(error);
  }
};
