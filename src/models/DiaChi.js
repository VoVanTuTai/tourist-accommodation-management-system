const db = require("../../config/db");
const crypto = require('crypto');

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


exports.create = async (data) => {
  const sql = `
    INSERT INTO DiaChi (ChiTiet, MaXa)
    VALUES (?, ?)
  `;
  const [result] = await db.execute(sql, [data.ChiTiet, data.MaXa]);
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

exports.addDiaChi = async (ChiTiet, MaXa) => {
  const randomBytes = crypto.randomBytes(5).toString('hex');
  const maDiaChi = `DC_${randomBytes}`.slice(0, 10);
  const sql = "INSERT INTO DiaChi (ChiTiet, MaXa) VALUES (?, ?)";
  const [result] = await db.execute(sql, [ChiTiet, MaXa]);
  return result.insertId;
};