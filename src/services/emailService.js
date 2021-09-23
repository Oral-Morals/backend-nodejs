const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  port: process.env.MAIL_PORT,
  host: process.env.MAIL_HOST,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  secure: true,
});

exports.sendMail = async (mailOptions = {}) => {
  try {
    const mailData = {
      from: process.env.SENDER_ADDRESS,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    };

    // console.log({ mailOptions, mailData });

    await transporter.sendMail(mailData, (info) => {
      console.log({ message: "Mail sent", message_id: info.message });
    });
  } catch (error) {
    console.log(error);
  }
};
