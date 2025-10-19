const db = require("../../config/db");


exports.getPhongByNCC = (maNhaCungCap, callback) => {
  const sql = "SELECT * FROM Phong WHERE MaNhaCungCap = ?";
  db.query(sql, [maNhaCungCap], callback);
};

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
