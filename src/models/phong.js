const db = require("../../config/db");

// src/models/phong.js

exports.getPhongByNCC = async (maNhaCungCap) => {
  const sql = `
    SELECT 
      p.MaPhong,
      p.TenPhong,
      p.Gia,
      p.SucChua,
      p.TinhTrang,
      p.HinhAnh,
      p.MaLoai,
      lp.TenLoai,
      p.MaNhaCungCap
    FROM phong p
    JOIN loaiphong lp ON p.MaLoai = lp.MaLoai
    WHERE p.MaNhaCungCap = ?
  `;
  const [rows] = await db.execute(sql, [maNhaCungCap]);
  return rows;
};

exports.getPhongById = async (maPhong) => {
  const [rows] = await db.execute("SELECT * FROM phong WHERE MaPhong = ?", [maPhong]);
  return rows;
};

exports.addPhong = async (data) => {
  const sql = `
    INSERT INTO phong (TenPhong, MaLoai, Gia, SucChua, TinhTrang, HinhAnh, MaNhaCungCap)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.TenPhong, data.MaLoai, data.Gia,
    data.SucChua, data.TinhTrang, data.HinhAnh, data.MaNhaCungCap
  ];
  await db.execute(sql, values);
};

exports.updatePhong = async (data) => {
  const sql = `
    UPDATE phong
    SET TenPhong=?, MaLoai=?, Gia=?, SucChua=?, TinhTrang=?, HinhAnh=?
    WHERE MaPhong=?
  `;
  const values = [
    data.TenPhong, data.MaLoai, data.Gia,
    data.SucChua, data.TinhTrang, data.HinhAnh, data.MaPhong
  ];
  await db.execute(sql, values);
};

exports.updateTrangThaiPhong = async (maPhong, tinhTrang) => {
  await db.execute("UPDATE phong SET TinhTrang=? WHERE MaPhong=?", [tinhTrang, maPhong]);
};


// Lấy danh sách phòng có nhiều lượt đặt nhất
exports.getTopBookedRooms = async () => {
  const query = `
    SELECT 
      p.MaPhong,
      p.TenPhong,
      p.MaLoai,
      p.Gia,
      COUNT(dp.MaCTDon) AS so_luot_dat
    FROM phong p
    LEFT JOIN chitietdondatphong dp ON p.MaPhong = dp.MaPhong
    GROUP BY p.MaPhong, p.TenPhong, p.MaLoai, p.Gia
    ORDER BY so_luot_dat DESC
    LIMIT 5;
  `;

  const [rows] = await db.execute(query);

  // Ép kiểu số cho cột 'Gia' (tránh lỗi khi render EJS)
  return rows.map(room => ({
    ...room,
    Gia: room.Gia ? Number(room.Gia) : 0,
  }));
};