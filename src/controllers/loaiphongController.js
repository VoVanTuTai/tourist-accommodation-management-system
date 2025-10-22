const db = require('../../config/db');

// Lấy danh sách loại phòng
exports.getLoaiPhongs = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT MaLoai, TenLoai FROM loaiphong ORDER BY TenLoai ASC');
    res.json(rows);
  } catch (err) {
    console.error('Lỗi khi lấy loại phòng:', err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};
