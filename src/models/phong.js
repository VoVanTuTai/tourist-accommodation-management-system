const db = require("../../config/db");

// ============================
// Lấy danh sách phòng theo Nhà cung cấp
// ============================
exports.getPhongByNCC = async (maNhaCungCap) => {
  try {
    const sql = `
      SELECT 
        p.MaPhong,
        p.TenPhong,
        p.Gia,
        p.SucChua,
        p.TinhTrang,
        p.HinhAnh,
        p.MoTa,
        p.MaDiaChi,
        p.MaLoai,
        lp.TenLoai,
        p.MaNhaCungCap
      FROM Phong p
      JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
      WHERE p.MaNhaCungCap = ?
    `;
    const [rows] = await db.execute(sql, [maNhaCungCap]);
    return rows;
  } catch (err) {
    console.error("❌ Lỗi getPhongByNCC:", err);
    throw err;
  }
};

// ============================
// Lấy thông tin chi tiết 1 phòng
// ============================
exports.getPhongById = async (id) => {
  const sql = `
    SELECT 
      p.*,
      dc.ChiTiet,
      x.TenXa,
      t.TenTinh
    FROM Phong p
    JOIN DiaChi dc ON p.MaDiaChi = dc.MaDiaChi
    JOIN Xa x ON dc.MaXa = x.MaXa
    JOIN Tinh t ON x.MaTinh = t.MaTinh
    WHERE p.MaPhong = ?
  `;
  const [rows] = await db.execute(sql, [id]);
  return rows[0];
};

// ============================
// Thêm phòng mới
// ============================
exports.addPhong = async (data) => {
  try {
    const sql = `
      INSERT INTO Phong (TenPhong, MaLoai, Gia, SucChua, TinhTrang, HinhAnh, MaDiaChi, MaNhaCungCap)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.TenPhong,
      data.MaLoai,
      data.Gia,
      data.SucChua,
      data.TinhTrang,
      data.HinhAnh,
      data.MoTa,
      data.MaDiaChi,
      data.MaNhaCungCap
    ];
    await db.execute(sql, values);
  } catch (err) {
    console.error("❌ Lỗi addPhong:", err);
    throw err;
  }
};

// ============================
// Cập nhật thông tin phòng
// ============================
exports.updatePhong = async (data) => {
  try {
    const safe = (v) => (v === undefined ? null : v);

    const sql = `
      UPDATE Phong
      SET TenPhong = ?, MaLoai = ?, Gia = ?, SucChua = ?, 
          TinhTrang = ?, HinhAnh = ?, MoTa = ?, MaDiaChi = ?
      WHERE MaPhong = ?
    `;
    const values = [
      safe(data.TenPhong),
      safe(data.MaLoai),
      safe(data.Gia),
      safe(data.SucChua),
      safe(data.TinhTrang),
      safe(data.HinhAnh),
      safe(data.MoTa),
      safe(data.MaDiaChi),
      safe(data.MaPhong)
    ];

    await db.execute(sql, values);
  } catch (err) {
    console.error("❌ Lỗi updatePhong:", err);
    throw err;
  }
};

// ============================
// Cập nhật trạng thái phòng
// ============================
exports.updateTrangThaiPhong = async (maPhong, tinhTrang) => {
  try {
    await db.execute("UPDATE Phong SET TinhTrang = ? WHERE MaPhong = ?", [tinhTrang, maPhong]);
  } catch (err) {
    console.error("❌ Lỗi updateTrangThaiPhong:", err);
    throw err;
  }
};

// ============================
// Lấy top phòng được đặt nhiều nhất
// ============================
exports.getTopBookedRooms = async () => {
  try {
    const query = `
      SELECT 
        p.MaPhong,
        p.TenPhong,
        p.MaLoai,
        p.Gia,
        COUNT(dp.MaCTDon) AS so_luot_dat
      FROM Phong p
      LEFT JOIN ChiTietDonDatPhong dp ON p.MaPhong = dp.MaPhong
      GROUP BY p.MaPhong, p.TenPhong, p.MaLoai, p.Gia
      ORDER BY so_luot_dat DESC
      LIMIT 10;
    `;
    const [rows] = await db.execute(query);

    // ✅ Ép kiểu giá về số
    return rows.map((room) => ({
      ...room,
      Gia: room.Gia ? Number(room.Gia) : 0,
    }));
  } catch (err) {
    console.error("❌ Lỗi getTopBookedRooms:", err);
    throw err;
  }
};
