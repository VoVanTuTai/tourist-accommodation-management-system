// ✅ 1. Phải nạp dotenv đầu tiên
require('dotenv').config(); 

const mysql = require('mysql2/promise');

// ✅ 2. Tạo pool kết nối
const db = mysql.createPool({
  host: process.env.DB_HOST, // Thêm giá trị dự phòng
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ 3. Kiểm tra kết nối
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Đã kết nối MySQL thành công!");
    connection.release(); 
  } catch (err) {
    console.error("❌ Kết nối MySQL thất bại. Vui lòng kiểm tra file .env hoặc MySQL service.");
    console.error("Chi tiết lỗi:", err.message);
  }
})();

module.exports = db;