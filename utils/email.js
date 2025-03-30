const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Mateusz Kapuściński <kapuscinski.mateusz01@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
