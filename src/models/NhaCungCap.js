
const dbPromise = require('../../config/db');

const NhaCungCap = {
  // 🔹 Lấy tất cả nhà cung cấp
  async getAll() {
    const db = await dbPromise;
    const [rows] = await db.execute('SELECT * FROM NhaCungCap');
    return rows;
  },

  // 🔹 Lấy nhà cung cấp theo ID
  async getById(maNCC) {
    const db = await dbPromise;
    const [rows] = await db.execute('SELECT * FROM NhaCungCap WHERE MaNCC = ?', [maNCC]);
    return rows[0];
  },

  // 🔹 Lấy nhà cung cấp theo tài khoản (JOIN TaiKhoan)
  async getByTaiKhoan(maTK) {
    const db = await dbPromise;
    const [rows] = await db.execute(`
      SELECT n.*
      FROM NhaCungCap n
      JOIN TaiKhoan t ON n.MaNCC = t.MaNCC
      WHERE t.MaTK = ?
    `, [maTK]);
    return rows[0];
  },

  // 🔹 Tạo mới nhà cung cấp
  async create({ TenNCC, ThongTinThanhToan, LoaiHinh, GiayPhepKD, TrangThai, MaDiaChi }) {
    const db = await dbPromise;
    const [result] = await db.execute(`
      INSERT INTO NhaCungCap (TenNCC, ThongTinThanhToan, LoaiHinh, GiayPhepKD, TrangThai, MaDiaChi)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [TenNCC, ThongTinThanhToan, LoaiHinh, GiayPhepKD, TrangThai || 'Chờ duyệt', MaDiaChi]);
    return result.insertId;
  },

  // 🔹 Cập nhật thông tin nhà cung cấp
  async update({ MaNCC, TenNCC, ThongTinThanhToan, LoaiHinh, GiayPhepKD, TrangThai, MaDiaChi }) {
    const db = await dbPromise;
    const [result] = await db.execute(`
      UPDATE NhaCungCap
      SET TenNCC = ?, ThongTinThanhToan = ?, LoaiHinh = ?, GiayPhepKD = ?, TrangThai = ?, MaDiaChi = ?
      WHERE MaNCC = ?
    `, [TenNCC, ThongTinThanhToan, LoaiHinh, GiayPhepKD, TrangThai, MaDiaChi, MaNCC]);
    return result.affectedRows > 0;
  },

  // 🔹 Xóa (hoặc vô hiệu hóa) nhà cung cấp
  async disable(maNCC) {
    const db = await dbPromise;
    const [result] = await db.execute(`
      UPDATE NhaCungCap SET TrangThai = 'Đã khóa' WHERE MaNCC = ?
    `, [maNCC]);
    return result.affectedRows > 0;
  }
};

// Đăng ký nhà cung cấp
// Thêm nha cung cap
const addNhaCungCap = async(data, callback) => {
  const sql = `
    INSERT INTO NhaCungCap (TenNCC, LoaiNganHang, ThongTinThanhToan, LoaiHinh, GiayPhepKD, MaDiaChi)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.TenNCC,
    data.LoaiNganHang,
    data.ThongTinThanhToan,
    data.LoaiHinh,
    data.GiayPhepKD,
    data.MaDiaChi,
  ];
  const [result] = await dbPromise.execute(sql, values);
  return result;
};

module.exports = { NhaCungCap, addNhaCungCap};