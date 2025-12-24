const db = require("../../config/db");

// ===== Lấy thông tin phòng =====
exports.getRoomById = async (maPhong) => {
  const sql = `
    SELECT p.MaPhong, p.TenPhong, p.Gia, p.SucChua, p.TinhTrang, p.HinhAnh,
           lp.TenLoai, d.ChiTiet AS DiaChiChiTiet, x.TenXa, t.TenTinh
    FROM phong p
    LEFT JOIN loaiphong lp ON p.MaLoai = lp.MaLoai
    LEFT JOIN diachi d ON p.MaDiaChi = d.MaDiaChi
    LEFT JOIN xa x ON d.MaXa = x.MaXa
    LEFT JOIN tinh t ON x.MaTinh = t.MaTinh
    WHERE p.MaPhong = ?`;
  const [rows] = await db.execute(sql, [maPhong]);
  return rows[0];
};

// ===== Tạo đơn đặt phòng (SỬA ĐỂ CHỐNG LỖI UNDEFINED) =====
exports.createOrder = async (payload) => {
  const sql = `
    INSERT INTO dondatphong 
    (MaKhachHang, TenNguoiNhan, SDTNguoiNhan, NgayDat, NgayNhan, NgayTra, TrangThai, TongTien) 
    VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)
  `;

  // ÉP KIỂU TẤT CẢ VỀ NULL NẾU LÀ UNDEFINED
  const params = [
    payload.MaKhachHang !== undefined ? payload.MaKhachHang : null,
    payload.TenNguoiNhan !== undefined ? payload.TenNguoiNhan : null,
    payload.SDTNguoiNhan !== undefined ? payload.SDTNguoiNhan : null,
    payload.NgayNhan !== undefined ? payload.NgayNhan : null,
    payload.NgayTra !== undefined ? payload.NgayTra : null,
    payload.TrangThai !== undefined ? payload.TrangThai : 'Đã đặt',
    payload.TongTien !== undefined ? payload.TongTien : 0
  ];

  console.log("🟢 Dữ liệu chuẩn bị lưu xuống MySQL (đã xử lý null):", params);

  try {
    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (err) {
    console.error("❌ Lỗi MySQL chi tiết:", err.sqlMessage || err.message);
    throw err;
  }
};