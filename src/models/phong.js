const db = require("../../config/db");

/* =====================================================
   ✅ 1. LẤY DANH SÁCH PHÒNG THEO NHÀ CUNG CẤP
===================================================== */
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

/* =====================================================
   ✅ 2. LẤY THÔNG TIN CHI TIẾT 1 PHÒNG
===================================================== */
exports.getPhongById = async (id) => {
  try {
    const sql = `
      SELECT 
        p.*,
        lp.TenLoai,
        dc.ChiTiet AS DiaChiChiTiet,
        x.TenXa,
        t.TenTinh
      FROM Phong p
      JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
      LEFT JOIN DiaChi dc ON p.MaDiaChi = dc.MaDiaChi
      LEFT JOIN Xa x ON dc.MaXa = x.MaXa
      LEFT JOIN Tinh t ON x.MaTinh = t.MaTinh
      WHERE p.MaPhong = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null; // ✅ trả về 1 object
  } catch (err) {
    console.error("❌ Lỗi getPhongById:", err);
    throw err;
  }
};

/* =====================================================
   ✅ 3. THÊM PHÒNG MỚI
===================================================== */
exports.addPhong = async (data) => {
  try {
    const sql = `
      INSERT INTO Phong 
      (TenPhong, MaLoai, Gia, SucChua, MoTa, TinhTrang, HinhAnh, MaDiaChi, MaNhaCungCap)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.TenPhong,
      data.MaLoai,
      data.Gia,
      data.SucChua,
      data.MoTa || null,
      data.TinhTrang,
      data.HinhAnh,
      data.MaDiaChi,
      data.MaNhaCungCap
    ];

    console.log("🧾 SQL Values:", values);
    await db.execute(sql, values);
  } catch (err) {
    console.error("❌ Lỗi addPhong:", err);
    throw err;
  }
};

/* =====================================================
   ✅ 4. LẤY TOÀN BỘ DANH SÁCH PHÒNG (CHO KHÁCH HÀNG)
===================================================== */
exports.getAllPhong = async () => {
  try {
    const sql = `
      SELECT 
        p.MaPhong,
        p.TenPhong,
        p.Gia,
        p.SucChua,
        p.TinhTrang,
        p.HinhAnh,
        p.DanhGia,
        lp.TenLoai,
        d.ChiTiet AS DiaChiChiTiet,
        x.TenXa,
        t.TenTinh
      FROM Phong p
      LEFT JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
      LEFT JOIN DiaChi d ON p.MaDiaChi = d.MaDiaChi
      LEFT JOIN Xa x ON d.MaXa = x.MaXa
      LEFT JOIN Tinh t ON x.MaTinh = t.MaTinh
    `;
    const [rows] = await db.execute(sql);
    return rows;
  } catch (err) {
    console.error("❌ Lỗi getAllPhong:", err);
    throw err;
  }
};

/* =====================================================
   ✅ 5. CẬP NHẬT THÔNG TIN PHÒNG
===================================================== */
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

/* =====================================================
   ✅ 6. CẬP NHẬT TRẠNG THÁI PHÒNG
===================================================== */
exports.updateTrangThaiPhong = async (maPhong, tinhTrang) => {
  try {
    await db.execute("UPDATE Phong SET TinhTrang = ? WHERE MaPhong = ?", [tinhTrang, maPhong]);
  } catch (err) {
    console.error("❌ Lỗi updateTrangThaiPhong:", err);
    throw err;
  }
};

/* =====================================================
   ✅ 7. LẤY TOP PHÒNG ĐƯỢC ĐẶT NHIỀU NHẤT
===================================================== */
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
