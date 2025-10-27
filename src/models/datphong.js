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
  const sql = `
    INSERT INTO dondatphong
    (MaKhachHang, MaPhong, NgayDat, NgayNhan, NgayTra, TrangThai, TongTien,
     Dat_HoTen, Dat_SDT, Dat_CCCD, Dat_NgaySinh, Dat_GioiTinh,
     Nhan_HoTen, Nhan_SDT, Nhan_CCCD, Nhan_NgaySinh, Nhan_GioiTinh)
    VALUES (?, ?, NOW(), ?, ?, 'Chưa thanh toán', ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // ⚙️ Chèn dữ liệu khớp với 17 dấu hỏi trong VALUES
  const params = [
    payload.MaKhachHang || null,
    payload.MaPhong || null,
    payload.NgayNhan || null,
    payload.NgayTra || null,
    payload.TongTien || null,

    payload.Dat_HoTen || null,
    payload.Dat_SDT || null,
    payload.Dat_CCCD || null,
    payload.Dat_NgaySinh || null,
    payload.Dat_GioiTinh || null,

    payload.Nhan_HoTen || null,
    payload.Nhan_SDT || null,
    payload.Nhan_CCCD || null,
    payload.Nhan_NgaySinh || null,
    payload.Nhan_GioiTinh || null
  ];

  // 🧩 Kiểm tra kỹ giá trị đầu vào (tránh undefined)
  console.log("🟢 Dữ liệu truyền xuống MySQL:", params);

  try {
    const [result] = await db.execute(sql, params);
    console.log("✅ Đã lưu đơn đặt phòng thành công, Mã đơn:", result.insertId);
    return result.insertId;
  } catch (err) {
    console.error("❌ Lỗi MySQL khi tạo đơn đặt phòng:", err.message);
    throw err;
  }
};
