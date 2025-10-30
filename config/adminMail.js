require("dotenv").config(); // ✅ Load biến từ .env
const nodemailer = require("nodemailer");

// Cấu hình transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Hàm gửi mail
exports.sendMail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Tourist Accommodation System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log("✅ Đã gửi mail tới:", to);
  } catch (error) {
    console.error("❌ Lỗi khi gửi mail:", error);
  }
};
