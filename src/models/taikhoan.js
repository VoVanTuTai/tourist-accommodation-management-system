const dbPromise = require('../../config/db');

const TaiKhoan = {
  // === Giữ nguyên code cũ ===
  async findByTaiKhoan(email) {
    try {
      const db = await dbPromise;
      const [rows] = await db.execute(
        'SELECT * FROM TaiKhoan WHERE TaiKhoan = ? LIMIT 1',
        [email]
      );
      return rows && rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error('⚠️ Lỗi trong findByTaiKhoan:', err);
      return null;
    }
  },

  async create({
    TaiKhoan,
    MatKhau,
    PhanQuyen = 'KhachHang',
    MaKhachHang = null,
    MaAdmin = null,
    MaNhaCungCap = null,
    TrangThai = 'HoatDong'
  }) {
    try {
      const db = await dbPromise;
      const [result] = await db.execute(
        `INSERT INTO TaiKhoan (TaiKhoan, MatKhau, PhanQuyen, MaKhachHang, MaAdmin, MaNhaCungCap, TrangThai)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          TaiKhoan || null,
          MatKhau || null,
          PhanQuyen || 'KhachHang',
          MaKhachHang || null,
          MaAdmin || null,
          MaNhaCungCap || null,
          TrangThai || 'HoatDong'
        ]
      );
      return result.insertId;
    } catch (err) {
      console.error('⚠️ Lỗi trong create TaiKhoan:', err);
      throw err;
    }
  },

  // === 🔹 Hàm mới: cập nhật mật khẩu nếu người dùng đổi ===
  async updatePasswordByMaTK(maTK, newHashPassword) {
    try {
      const db = await dbPromise;
      const [result] = await db.execute(
        `UPDATE TaiKhoan SET MatKhau = ? WHERE MaTaiKhoan = ?`,
        [newHashPassword, maTK]
      );
      return result.affectedRows;
    } catch (err) {
      console.error('⚠️ Lỗi trong updatePasswordByMaTK:', err);
      throw err;
    }
  }
};

module.exports = TaiKhoan;
