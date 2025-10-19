const db = require("../../config/db");

// Lấy tất cả loại phòng
exports.getAll = (callback) => {
  const sql = "SELECT * FROM LoaiPhong";
  db.query(sql, callback);
};

// Lấy loại phòng theo mã
exports.getById = (maLoai, callback) => {
  const sql = "SELECT * FROM LoaiPhong WHERE MaLoai = ?";
  db.query(sql, [maLoai], callback);
};

// (Tùy chọn) Thêm loại phòng mới
exports.add = (data, callback) => {
  const sql = "INSERT INTO LoaiPhong (TenLoai, MoTa) VALUES (?, ?)";
  db.query(sql, [data.TenLoai, data.MoTa || null], callback);
};

// (Tùy chọn) Cập nhật loại phòng
exports.update = (data, callback) => {
  const sql = "UPDATE LoaiPhong SET TenLoai=?, MoTa=? WHERE MaLoai=?";
  db.query(sql, [data.TenLoai, data.MoTa, data.MaLoai], callback);
};

// (Tùy chọn) Xóa loại phòng
exports.delete = (maLoai, callback) => {
  const sql = "DELETE FROM LoaiPhong WHERE MaLoai=?";
  db.query(sql, [maLoai], callback);
};
