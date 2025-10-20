const dbPromise = require('../../config/db');

const TaiKhoan = {
  /**
   * 🔹 Tìm tài khoản theo email (tên đăng nhập)
   * @param {string} email
   * @returns {object|null} - Thông tin tài khoản hoặc null nếu không có
   */
  async findByTaiKhoan(email) {
    try {
      const db = await dbPromise;
      const [rows] = await db.execute(
        'SELECT * FROM TaiKhoan WHERE TaiKhoan = ? LIMIT 1',
        [email]
      );

      // ✅ Luôn trả về 1 object hoặc null
      if (rows && rows.length > 0) {
        return rows[0];
      } else {
        return null;
      }
    } catch (err) {
      console.error('⚠️ Lỗi trong findByTaiKhoan:', err);
      return null; // tránh văng lỗi ra controller
    }
  },

  /**
   * 🔹 Tạo tài khoản mới (dùng khi đăng ký)
   * @param {object} data - chứa các trường { TaiKhoan, MatKhau, PhanQuyen, MaKhachHang, MaAdmin }
   * @returns {number} - ID tài khoản mới tạo
   */
  async create({
    TaiKhoan,
    MatKhau,
    PhanQuyen = 'KhachHang',
    MaKhachHang = null,
    MaAdmin = null
  }) {
    try {
      const db = await dbPromise;
      const [result] = await db.execute(
        `INSERT INTO TaiKhoan (TaiKhoan, MatKhau, PhanQuyen, MaKhachHang, MaAdmin)
         VALUES (?, ?, ?, ?, ?)`,
        [
          TaiKhoan || null,
          MatKhau || null,
          PhanQuyen || 'KhachHang',
          MaKhachHang || null,
          MaAdmin || null
        ]
      );
      return result.insertId;
    } catch (err) {
      console.error('⚠️ Lỗi trong create TaiKhoan:', err);
      throw err; // để controller bắt lỗi và hiển thị đúng
    }
  }
};

module.exports = TaiKhoan;
