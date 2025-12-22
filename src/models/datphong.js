const db = require("../../config/db");

// ===== Lấy thông tin phòng =====
exports.getRoomById = async (maPhong) => {
  const sql = `
    SELECT p.MaPhong, p.TenPhong, p.Gia, p.SucChua, p.TinhTrang, p.HinhAnh,
           lp.TenLoai, d.ChiTiet AS DiaChiChiTiet, x.TenXa, t.TenTinh
    FROM Phong p
    LEFT JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
    LEFT JOIN DiaChi d ON p.MaDiaChi = d.MaDiaChi
    LEFT JOIN Xa x ON d.MaXa = x.MaXa
    LEFT JOIN Tinh t ON x.MaTinh = t.MaTinh
    WHERE p.MaPhong = ?`;
  const [rows] = await db.execute(sql, [maPhong]);
  return rows[0];
};

// ===== Tạo đơn đặt phòng =====
exports.createOrder = async (payload) => {
  // SQL chỉ sử dụng những cột thực sự tồn tại trong DB của bạn
  const sql = `
    INSERT INTO DonDatPhong 
    (MaKhachHang, MaPhong, TenNguoiNhan, SDTNguoiNhan, NgayDat, NgayNhan, NgayTra, TrangThai, TongTien) 
    VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)
  `;

  // Chuẩn bị tham số khớp với các cột trên
  const params = [
    payload.MaKhachHang || null,     // MaKhachHang
    payload.MaPhong || null,         // MaPhong (Đảm bảo bảng đã có cột này)
    payload.TenNguoiNhan || null,    // Map từ Nhan_HoTen sang TenNguoiNhan
    payload.SDTNguoiNhan || null,    // Map từ Nhan_SDT sang SDTNguoiNhan
    payload.NgayNhan || null,        // NgayNhan
    payload.NgayTra || null,         // NgayTra
    'Chưa thanh toán',               // TrangThai
    payload.TongTien || 0            // TongTien
  ];

  console.log("🟢 Dữ liệu chuẩn bị lưu xuống MySQL:", params);

  try {
    const [result] = await db.execute(sql, params);
    return result.insertId;
  } catch (err) {
    console.error("❌ Lỗi MySQL:", err.message);
    throw err;
  }
};