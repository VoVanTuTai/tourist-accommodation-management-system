const db = require("../../config/db");

exports.getPhongById = async (maPhong) => {
  try {
    const sql = `
      SELECT 
        p.MaPhong,
        p.TenPhong,
        p.Gia,
        p.SucChua,
        p.TinhTrang,
        p.HinhAnh,
        p.MoTa,
        lp.TenLoai,
        d.ChiTiet AS DiaChiChiTiet,
        x.TenXa,
        t.TenTinh
      FROM Phong p
      LEFT JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
      LEFT JOIN DiaChi d ON p.MaDiaChi = d.MaDiaChi
      LEFT JOIN Xa x ON d.MaXa = x.MaXa
      LEFT JOIN Tinh t ON x.MaTinh = t.MaTinh
      WHERE p.MaPhong = ?;
    `;
    const [rows] = await db.execute(sql, [maPhong]);
    return rows[0];
  } catch (err) {
    console.error("❌ Lỗi getPhongById:", err);
    throw err;
  }
};
