const db = require("../../config/db");

exports.getCommissionData = async (from, to) => {
  let sql = `
    SELECT 
      ncc.MaNCC,
      ncc.TenNCC,
      SUM(tt.SoTien * 0.10) AS TongHoaHong
    FROM thanhtoan tt
    JOIN chitietdondatphong ct ON tt.MaDon = ct.MaDon
    JOIN phong p ON ct.MaPhong = p.MaPhong
    JOIN nhacungcap ncc ON p.MaNhaCungCap = ncc.MaNCC
    WHERE 1=1
  `;

  const params = [];

  if (from && to) {
    sql += ` AND tt.NgayTT BETWEEN ? AND ? `;
    params.push(from, to);
  }

  sql += `
    GROUP BY ncc.MaNCC, ncc.TenNCC
    HAVING TongHoaHong > 0
    ORDER BY TongHoaHong DESC
  `;

  const [rows] = await db.query(sql, params);
  return rows;
};
