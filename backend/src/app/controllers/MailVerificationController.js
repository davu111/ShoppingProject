const codeModel = require("../models/VerificationCode");
const mailService = require("../services/mailService");

exports.sendCode = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Email không được để trống" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeModel.saveCode(email, code, 120); // TTL: 120 giây

  try {
    await mailService.sendVerificationEmail(email, code);
    res.json({ message: "Verification code has been sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "System error" });
  }
};

exports.verifyCode = (req, res) => {
  const { email, code } = req.body;
  const storedCode = codeModel.getCode(email);

  if (storedCode === code) {
    codeModel.deleteCode(email);
    res.json({ message: "Verification success" });
  } else {
    res.status(400).json({ message: "Not correct code" });
  }
};
