const db = require("../../config/db");

// Lấy danh sách phòng theo NCC
exports.getPhongByNCC = (maNhaCungCap, callback) => {
  const sql = `
    SELECT 
      p.MaPhong,
      p.TenPhong,
      p.Gia,
      p.SucChua,
      p.TinhTrang,
      p.HinhAnh,
      p.MaLoai,
      lp.TenLoai,              -- ✅ Lấy tên loại phòng từ bảng LoaiPhong
      p.MaNhaCungCap
    FROM Phong p
    JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
    WHERE p.MaNhaCungCap = ?
  `;
  db.query(sql, [maNhaCungCap], callback);
};

// Lấy thông tin 1 phòng
exports.getPhongById = (maPhong, callback) => {
  const sql = "SELECT * FROM Phong WHERE MaPhong = ?";
  db.query(sql, [maPhong], callback);
};

// Thêm phòng
exports.addPhong = (data, callback) => {
  const sql = `
    INSERT INTO Phong (TenPhong, MaLoai, Gia, SucChua, TinhTrang, HinhAnh, MaNhaCungCap)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.TenPhong,
    data.MaLoai,
    data.Gia,
    data.SucChua,
    data.TinhTrang,
    data.HinhAnh,
    data.MaNhaCungCap
  ];
  db.query(sql, values, callback);
};

// Cập nhật phòng
exports.updatePhong = (data, callback) => {
  const sql = `
    UPDATE Phong
    SET TenPhong=?, MaLoai=?, Gia=?, SucChua=?, TinhTrang=?, HinhAnh=?
    WHERE MaPhong=?
  `;
  const values = [
    data.TenPhong,
    data.MaLoai,
    data.Gia,
    data.SucChua,
    data.TinhTrang,
    data.HinhAnh,
    data.MaPhong
  ];
  db.query(sql, values, callback);
};

// Cập nhật trạng thái phòng
exports.updateTrangThaiPhong = (maPhong, tinhTrang, callback) => {
  const sql = "UPDATE Phong SET TinhTrang=? WHERE MaPhong=?";
  db.query(sql, [tinhTrang, maPhong], callback);
};
