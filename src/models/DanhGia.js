const db = require("../../config/db");

const DanhGia = {
  // Lấy 1 đánh giá theo khách hàng + phòng
  async getByUserAndPhong(maKhachHang, maPhong) {
    if (!maKhachHang || !maPhong) {
      throw new Error("Thiếu tham số bắt buộc");
    }
  
    const sql = `
      SELECT 
        dg.*,
        ph.NoiDung AS PhanHoiNoiDung,
        ph.NgayPH AS PhanHoiNgay,
        ph.MaNhaCungCap AS PhanHoiMaNCC
      FROM DanhGia dg
      LEFT JOIN PhanHoi ph ON ph.MaDanhGia = dg.MaDanhGia
      WHERE dg.MaKhachHang = ? AND dg.MaPhong = ?
      LIMIT 1
    `;
  
    const [rows] = await db.execute(sql, [maKhachHang, maPhong]);
    return rows[0] || null;
  },
  

  // Thêm đánh giá mới (theo phòng)
  async insert({ MaKhachHang, MaPhong, SoSao, NoiDung, HinhAnh }) {
    if (!MaKhachHang || !MaPhong) {
      console.error("insert: Thiếu tham số", { MaKhachHang, MaPhong });
      throw new Error("Thiếu tham số bắt buộc");
    }
    const sql = `
      INSERT INTO DanhGia (MaKhachHang, MaPhong, NgayDang, SoSao, NoiDung, HinhAnh)
      VALUES (?, ?, CURDATE(), ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [MaKhachHang, MaPhong, SoSao, NoiDung, HinhAnh]);
    return result.insertId;
  },

  // Cập nhật đánh giá theo (MaKhachHang, MaPhong)
  async update({ MaKhachHang, MaPhong, SoSao, NoiDung, HinhAnh }) {
    if (!MaKhachHang || !MaPhong) {
      console.error("update: Thiếu tham số", { MaKhachHang, MaPhong });
      throw new Error("Thiếu tham số bắt buộc");
    }
    const sql = `
      UPDATE DanhGia
      SET SoSao = ?, NoiDung = ?, HinhAnh = ?, NgayDang = CURDATE()
      WHERE MaKhachHang = ? AND MaPhong = ?
    `;
    const [result] = await db.execute(sql, [SoSao, NoiDung, HinhAnh, MaKhachHang, MaPhong]);
    return result.affectedRows > 0;
  },
  
  async getPhanHoiByMaDanhGia(maDanhGia) {
    const sql = `
      SELECT *
      FROM PhanHoi
      WHERE MaDanhGia = ?
      LIMIT 1
    `;
    const [rows] = await db.execute(sql, [maDanhGia]);
    return rows[0] || null;
  }
  
  
};

module.exports = DanhGia;
