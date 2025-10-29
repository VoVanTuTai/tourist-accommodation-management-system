const db = require("../../config/db");

// Lấy tất cả khách hàng
exports.getAllCustomers = async () => {
  const sql = `
    SELECT 
      a.MaTaiKhoan,
      a.TaiKhoan AS Email,
      a.TrangThai,
      b.MaKhachHang,
      b.HoTen,
      b.GioiTinh,
      b.NgaySinh,
      b.SoDienThoai
    FROM TaiKhoan a
    JOIN KhachHang b ON a.MaTaiKhoan = b.MaTaiKhoan
    where a.PhanQuyen = 'KhachHang'
  `;
  const [rows] = await db.query(sql);
  return rows;
};

// Tìm kiếm theo mã hoặc tên khách hàng
exports.searchByIdOrName = async (keyword) => {
  const sql = `
    SELECT 
      a.MaTaiKhoan,
      a.TaiKhoan AS Email,
      a.TrangThai,
      b.MaKhachHang,
      b.HoTen,
      b.GioiTinh,
      b.NgaySinh,
      b.SoDienThoai
    FROM TaiKhoan a
    JOIN KhachHang b ON a.MaTaiKhoan = b.MaTaiKhoan
    WHERE a.PhanQuyen = 'KhachHang' and b.MaKhachHang LIKE? OR b.HoTen LIKE ?
  `;
  const [rows] = await db.query(sql, [`%${keyword}%`, `%${keyword}%`]);
  return rows;
};

// Lấy chi tiết 1 khách hàng
exports.findById = async (maKH) => {
  const sql = `
    SELECT 
      a.MaTaiKhoan,
      a.TaiKhoan AS Email,
      a.TrangThai,
      b.MaKhachHang,
      b.HoTen,
      b.GioiTinh,
      b.NgaySinh,
      b.SoDienThoai
    FROM TaiKhoan a
    JOIN KhachHang b ON a.MaTaiKhoan = b.MaTaiKhoan
    WHERE b.MaKhachHang = ?
    LIMIT 1
  `;
  const [rows] = await db.query(sql, [maKH]);
  return rows[0] || null;
};

// Cập nhật trạng thái khách hàng
// Cập nhật trạng thái khách hàng (bảng TaiKhoan)
exports.updateStatus = async (MaKhachHang, status) => {
  const sql = `
    UPDATE TaiKhoan
    SET TrangThai = ?
    WHERE MaTaiKhoan = (
      SELECT MaTaiKhoan FROM KhachHang WHERE MaKhachHang = ?
    )
  `;

  try {
    const [result] = await db.query(sql, [status, MaKhachHang]);
    console.log("✅ Cập nhật trạng thái:", result.affectedRows, "dòng bị ảnh hưởng");
    return result.affectedRows > 0;
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật trạng thái:", err);
    return false;
  }
};

