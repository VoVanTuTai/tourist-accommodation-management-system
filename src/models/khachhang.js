const dbPromise = require('../../config/db');

const KhachHang = {
  // === Giữ nguyên các hàm cũ ===
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

  },
  // === 🔹 Hàm mới: Lấy thông tin KH theo MaTK (để hiển thị trong trang cá nhân) ===
  async findByMaTK(maTK) {
    const db = await dbPromise;
    const [rows] = await db.execute(
      `SELECT kh.*, tk.TaiKhoan, tk.PhanQuyen
       FROM KhachHang kh
       JOIN TaiKhoan tk ON kh.MaKhachHang = tk.MaKhachHang
       WHERE tk.MaTaiKhoan = ? LIMIT 1`,
      [maTK]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // === 🔹 Hàm mới: Cập nhật thông tin KH được phép sửa ===
  async updateByMaTK(maTK, { HoTen, SoDienThoai, GioiTinh }) {
    const db = await dbPromise;

    const fields = [];
    const values = [];

    if (HoTen !== undefined) {
      fields.push('HoTen = ?');
      values.push(HoTen);
    }
    if (SoDienThoai !== undefined) {
      fields.push('SoDienThoai = ?');
      values.push(SoDienThoai);
    }
    if (GioiTinh !== undefined) {
      fields.push('GioiTinh = ?');
      values.push(GioiTinh);
    }

    if (fields.length === 0) return 0;

    values.push(maTK);

    const sql = `
      UPDATE KhachHang
      JOIN TaiKhoan ON KhachHang.MaKhachHang = TaiKhoan.MaKhachHang
      SET ${fields.join(', ')}
      WHERE TaiKhoan.MaTaiKhoan = ?;
    `;

    const [result] = await db.execute(sql, values);
    return result.affectedRows;

  }
};
module.exports = KhachHang;
