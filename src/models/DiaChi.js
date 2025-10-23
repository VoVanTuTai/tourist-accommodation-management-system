const db = require("../../config/db");

// Lấy địa chỉ theo mã địa chỉ
exports.getById = async (maDiaChi) => {
  const sql = `
    SELECT dc.MaDiaChi, dc.ChiTiet, x.MaXa, x.TenXa, t.MaTinh, t.TenTinh
    FROM DiaChi dc
    JOIN Xa x ON dc.MaXa = x.MaXa
    JOIN Tinh t ON x.MaTinh = t.MaTinh
    WHERE dc.MaDiaChi = ?
  `;
  const [rows] = await db.execute(sql, [maDiaChi]);
  return rows[0];
};

// Tạo mới địa chỉ
exports.create = async ({ ChiTiet, MaXa, MaNhaCungCap }) => {
  const sql = `
    INSERT INTO DiaChi (ChiTiet, MaXa, MaNhaCungCap)
    VALUES (?, ?, ?)
  `;
  const [result] = await db.execute(sql, [ChiTiet, MaXa, MaNhaCungCap]);
  return result.insertId;
};

// Cập nhật địa chỉ hiện có
exports.update = async ({ MaDiaChi, ChiTiet, MaXa }) => {
  const sql = `
    UPDATE DiaChi
    SET ChiTiet = ?, MaXa = ?
    WHERE MaDiaChi = ?
  `;
  await db.execute(sql, [ChiTiet, MaXa, MaDiaChi]);
};
