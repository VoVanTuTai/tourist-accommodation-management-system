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