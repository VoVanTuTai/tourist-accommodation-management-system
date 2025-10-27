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
//exports.getPhongById = async (maPhong) => {
  //try {
    //const [rows] = await db.execute("SELECT * FROM Phong WHERE MaPhong = ?", [maPhong]);
    //return rows[0] || null; // ✅ chỉ trả về 1 object
  //} catch (err) {
    //console.error("❌ Lỗi getPhongById:", err);
    //throw err;
  //}
//};

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
      data.MaDiaChi,
      data.MaNhaCungCap
    ];
    await db.execute(sql, values);
  } catch (err) {
    console.error("❌ Lỗi addPhong:", err);
    throw err;
  }
};

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
      FROM phong p
      LEFT JOIN loaiphong lp ON p.MaLoai = lp.MaLoai
      LEFT JOIN diachi d ON p.MaDiaChi = d.MaDiaChi
      LEFT JOIN xa x ON d.MaXa = x.MaXa
      LEFT JOIN tinh t ON x.MaTinh = t.MaTinh;
    `;
    const [rows] = await db.execute(sql);
    return rows;
  } catch (err) {
    console.error("❌ Lỗi getAllPhong:", err);
    throw err;
  }
};

// ============================
// Cập nhật thông tin phòng
// ============================
exports.updatePhong = async (data) => {
  try {
    const sql = `
      UPDATE Phong
      SET TenPhong = ?, MaLoai = ?, Gia = ?, SucChua = ?, TinhTrang = ?, HinhAnh = ?, MaDiaChi = ?
      WHERE MaPhong = ?
    `;
    const values = [
      data.TenPhong,
      data.MaLoai,
      data.Gia,
      data.SucChua,
      data.TinhTrang,
      data.HinhAnh,
      data.MaDiaChi,
      data.MaPhong
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
