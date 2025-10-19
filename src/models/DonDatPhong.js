const db = require("../../config/db");

const DonDatPhong = {
  getAllByUser: (userId, trangThai, callback) => {
    let sql = `
      SELECT 
      dp.MaDon,
      dp.NgayDat,
      dp.NgayNhan,
      dp.NgayTra,
      dp.TrangThai,
      dp.TongTien,
      GROUP_CONCAT(DISTINCT ncc.TenNCC SEPARATOR ', ') AS TenChoO
      FROM dondatphong dp
      LEFT JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
      LEFT JOIN phong p ON ctdp.MaPhong = p.MaPhong
      LEFT JOIN nhacungcap ncc ON p.MaNhaCungCap = ncc.MaNCC
      WHERE dp.MaKhachHang = ?
    `;

    const params = [userId];

    // nếu có trạng thái (0,1,2,3)
    if (trangThai !== undefined && trangThai !== "") {
      sql += " AND dp.TrangThai = ?";
      params.push(parseInt(trangThai));
    }

    // gom nhóm theo mã đơn (vì 1 đơn có thể có nhiều phòng)
    sql += " GROUP BY dp.MaDon ORDER BY dp.NgayDat DESC";

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error("❌ Lỗi SQL:", err.sqlMessage);
        return callback(err);
      }
      callback(null, results);
    });
  },
};

module.exports = DonDatPhong;
