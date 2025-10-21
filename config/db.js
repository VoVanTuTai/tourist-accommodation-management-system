// ✅ Dùng mysql2/promise (hỗ trợ async/await)
const mysql = require('mysql2/promise');

// ✅ Tạo pool kết nối (an toàn, không cần connect thủ công)
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "quanlidatphong",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Kiểm tra kết nối (tùy chọn, để log khi khởi động)
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Đã kết nối MySQL thành công!");
    connection.release(); // Trả lại pool
  } catch (err) {
    console.error("❌ Kết nối MySQL thất bại:", err);
  }
})();

module.exports = db;
