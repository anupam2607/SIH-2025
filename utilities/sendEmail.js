const transporter = require("../config/email");

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", subject);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
};

module.exports = sendEmail;
