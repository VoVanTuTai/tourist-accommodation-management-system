const db = require('../../config/db');

// Lấy danh sách tỉnh
exports.getTinhs = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT MaTinh, TenTinh FROM Tinh ORDER BY TenTinh');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tỉnh' });
  }
};

// Lấy danh sách xã theo tỉnh
exports.getXasByTinh = async (req, res) => {
  try {
    const { maTinh } = req.params;
    const [rows] = await db.execute('SELECT MaXa, TenXa FROM Xa WHERE MaTinh = ?', [maTinh]);
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách xã' });
  }
};
