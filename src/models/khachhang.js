const dbPromise = require('../../config/db');

const KhachHang = {
  // 🔹 Tìm theo Email (để tránh trùng)
  async findByEmail(email) {
    const db = await dbPromise;
    const [rows] = await db.execute('SELECT * FROM KhachHang WHERE Email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  // 🔹 Thêm khách hàng mới sau khi đã có MaTaiKhoan
  async create({ MaTaiKhoan, HoTen, Email, SoDienThoai, NgaySinh, GioiTinh }) {
    if (!MaTaiKhoan) throw new Error("Thiếu MaTaiKhoan khi tạo KhachHang");

    const db = await dbPromise;
    const [result] = await db.execute(
      `INSERT INTO KhachHang (MaTaiKhoan, HoTen, Email, SoDienThoai, NgaySinh, GioiTinh)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [MaTaiKhoan, HoTen, Email, SoDienThoai, NgaySinh, GioiTinh]
    );

    return result.insertId;
  },

  // 🔹 Lấy thông tin KH theo MaTaiKhoan
  async findByMaTK(maTaiKhoan) {
    const db = await dbPromise;
    const [rows] = await db.execute(
      'SELECT * FROM KhachHang WHERE MaTaiKhoan = ? LIMIT 1',
      [maTaiKhoan]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // 🔹 Lấy thông tin KH theo MaKhachHang
  async findById(maKhachHang) {
    const db = await dbPromise;
    const [rows] = await db.execute(
      'SELECT * FROM KhachHang WHERE MaKhachHang = ? LIMIT 1',
      [maKhachHang]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  // 🔹 Cập nhật thông tin KH (theo MaTaiKhoan)
  async updateByMaTK(maTaiKhoan, { HoTen, SoDienThoai, GioiTinh, NgaySinh }) {
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
    if (NgaySinh !== undefined) {
      fields.push('NgaySinh = ?');
      values.push(NgaySinh);
    }

    if (fields.length === 0) return 0;

    values.push(maTaiKhoan);

    const sql = `
      UPDATE KhachHang
      SET ${fields.join(', ')}
      WHERE MaTaiKhoan = ?;
    `;

    const [result] = await db.execute(sql, values);
    return result.affectedRows;
  }
};

module.exports = KhachHang;
