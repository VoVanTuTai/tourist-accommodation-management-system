const mysql = require("mysql2");

// Tạo kết nối đến database của bạn
const db = mysql.createConnection({
  host: "localhost",       // hoặc IP server DB của bạn
  user: "root",            // user MySQL
  password: "",            // mật khẩu (điền nếu có)
  database: "quanlidatphong", // tên CSDL bạn đang dùng
});

// Kiểm tra kết nối
db.connect((err) => {
  if (err) {
    console.error("❌ Kết nối MySQL thất bại:", err);
  } else {
    console.log("✅ Đã kết nối MySQL thành công!");
  }
});

module.exports = db;
