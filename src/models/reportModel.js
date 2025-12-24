const db = require("../../config/db");

exports.getCommissionData = async (from, to) => {
  // Sử dụng DISTINCT để tránh nhân đôi tiền khi một đơn có nhiều phòng
  // Sử dụng LEFT JOIN để đảm bảo không mất dữ liệu thanh toán
  let sql = `
    SELECT 
      ncc.MaNCC,
      IFNULL(ncc.TenNCC, 'Chưa xác định') AS TenNCC,
      SUM(sub.SoTienHoaHong) AS TongHoaHong
    FROM (
      SELECT DISTINCT
        tt.MaDon,
        tt.SoTien * 0.10 AS SoTienHoaHong,
        tt.NgayTT,
        p.MaNhaCungCap
      FROM thanhtoan tt
      LEFT JOIN chitietdondatphong ct ON tt.MaDon = ct.MaDon
      LEFT JOIN phong p ON ct.MaPhong = p.MaPhong
    ) AS sub
    LEFT JOIN nhacungcap ncc ON sub.MaNhaCungCap = ncc.MaNCC
    WHERE 1=1
  `;

  const params = [];

  // Kiểm tra nếu có lọc ngày
  if (from && to) {
    sql += ` AND sub.NgayTT BETWEEN ? AND ? `;
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