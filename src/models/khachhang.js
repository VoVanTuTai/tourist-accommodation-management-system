const dbPromise = require('../../config/db');

const KhachHang = {
  async findByEmail(email) {
    const db = await dbPromise;
    const [rows] = await db.execute('SELECT * FROM KhachHang WHERE Email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  async create({ HoTen, Email, SoDienThoai, NgaySinh, GioiTinh }) {
    const db = await dbPromise;
    const [result] = await db.execute(
      'INSERT INTO KhachHang (HoTen, Email, SoDienThoai, NgaySinh, GioiTinh) VALUES (?, ?, ?, ?, ?)',
      [HoTen, Email, SoDienThoai, NgaySinh, GioiTinh]
    );
    return result.insertId;
  },
  async getByTaiKhoan(maTaiKhoan) {
    const db = await dbPromise;
    const sql = `
      SELECT kh.*
      FROM KhachHang kh
      JOIN TaiKhoan tk ON kh.MaKhachHang = tk.MaKhachHang
      WHERE tk.MaTaiKhoan = ?
    `;
    const [rows] = await db.execute(sql, [maTaiKhoan]);
    return rows.length > 0 ? rows[0] : null;
  }
};
module.exports = KhachHang;
