const db = require("../../config/db");

// Bổ sung column LoaiNganHang
exports.addColumnLoaiNganHang = (callback) => {
  const sql = "ALTER TABLE NhaCungCap ADD COLUMN LoaiNganHang VARCHAR(255)";
  db.query(sql, callback);
}

// Đăng ký nhà cung cấp
// Thêm nha cung cap
exports.addNhaCungCap = async(data, callback) => {
  const sql = `
    INSERT INTO NhaCungCap (TenNCC, LoaiNganHang, ThongTinThanhToan, LoaiHinh, GiayPhepKD)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    data.TenNCC,
    data.LoaiNganHang,
    data.ThongTinThanhToan,
    data.LoaiHinh,
    data.GiayPhepKD
  ];
  const [result] = await db.execute(sql, values);
  return result;
};
