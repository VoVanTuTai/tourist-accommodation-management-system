const db = require("../../config/db");

// 🟢 Lấy toàn bộ nhà cung cấp
exports.getAllProviders = async () => {
  const sql = `
    SELECT 
      a.MaTaiKhoan,
      a.TaiKhoan AS Email,   -- cột 'TaiKhoan' được đổi tên thành 'Email' khi trả về
      a.TrangThai, b.TenNCC, b.ThongTinThanhToan, b.LoaiHinh, b.MaNCC
    FROM TaiKhoan a
    JOIN NhaCungCap b ON a.MaTaiKhoan = b.MaTaiKhoan
    where a.PhanQuyen = 'NhaCungCap'
  `;
  const [rows] = await db.query(sql);
  return rows;
};

// 🟡 Lọc nhà cung cấp theo trạng thái
exports.getProvidersByStatus = async (status) => {
  const sql = `
    SELECT 
      a.MaTaiKhoan,
      a.TaiKhoan AS Email,   -- alias lại
      a.TrangThai, b.TenNCC, b.ThongTinThanhToan, b.LoaiHinh, b.MaNCC
    FROM TaiKhoan a
    JOIN NhaCungCap b ON a.MaTaiKhoan = b.MaTaiKhoan
    WHERE  a.PhanQuyen = 'NhaCungCap' and a.TrangThai = ?
  `;
  const [rows] = await db.query(sql, [status]);
  return rows;
};

// 🔴 Cập nhật trạng thái nhà cung cấp
exports.updateProviderStatus = async (MaTaiKhoan, TrangThai) => {
  const sql = `
    UPDATE TaiKhoan
    SET TrangThai = ?
    WHERE MaTaiKhoan = ?
  `;
  const [result] = await db.query(sql, [TrangThai, MaTaiKhoan]);
  return result.affectedRows > 0;
};
