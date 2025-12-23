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

// ===== Tạo đơn đặt phòng =====
exports.createOrder = async (payload) => {
  // SQL khớp 100% với bảng dondatphong (ảnh bcf1c2.jpg)
  const sql = `
    INSERT INTO dondatphong 
    (MaKhachHang, TenNguoiNhan, SDTNguoiNhan, NgayDat, NgayNhan, NgayTra, TrangThai, TongTien) 
    VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)
  `;

  const params = [
    payload.MaKhachHang,      // ID từ session (19)
    payload.TenNguoiNhan, 
    payload.SDTNguoiNhan, 
    payload.NgayNhan, 
    payload.NgayTra, 
    payload.TrangThai, 
    payload.TongTien
  ];

  console.log("🟢 Dữ liệu chuẩn bị lưu xuống MySQL:", params);

  try {
    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (err) {
    console.error("❌ Lỗi MySQL chi tiết:", err.sqlMessage);
    throw err;
  }
};