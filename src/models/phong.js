import db from "../../config/db.js";

// Lấy danh sách tất cả các phòng
export const getAllRooms = async () => {
  const [rows] = await db.query(`
    SELECT 
      p.MaPhong,
      p.TenPhong,
      lp.TenLoai,
      p.Gia,
      p.SucChua,
      p.TinhTrang,
      p.HinhAnh
    FROM Phong p
    JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai;
  `);
  return rows;
};
