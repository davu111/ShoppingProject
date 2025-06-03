const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = {
  async sendVerificationEmail(to, code) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "Mã xác thực đăng nhập",
      text: `Mã xác thực của bạn là: ${code}`,
    };
    return transporter.sendMail(mailOptions);
  },
};
