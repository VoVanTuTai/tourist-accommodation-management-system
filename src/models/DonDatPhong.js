const db = require("../../config/db");

/**
 * Model: DonDatPhong
 * Mục đích: Lấy danh sách đơn đặt phòng của khách hàng
 * Hỗ trợ lọc theo trạng thái (0 = Đã đặt, 1 = Đang sử dụng, 2 = Hoàn tất, 3 = Đã hủy)
 */

const DonDatPhong = {
  /**
   * Lấy tất cả đơn đặt phòng theo khách hàng
   * @param {number} userId - Mã khách hàng
   * @param {string|number} trangThai - Trạng thái đơn (có thể rỗng)
   * @returns {Promise<Array>} - Danh sách đơn đặt phòng
   */
  getAllByUser: async (userId, trangThai) => {
    try {
      // ✅ Tạo truy vấn SQL cơ bản
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

      // ✅ Thêm điều kiện lọc nếu có trạng thái
      const params = [userId];
      if (trangThai !== undefined && trangThai !== "") {
        sql += " AND dp.TrangThai = ?";
        params.push(parseInt(trangThai));
      }

      // ✅ Gom nhóm và sắp xếp theo ngày đặt mới nhất
      sql += " GROUP BY dp.MaDon ORDER BY dp.NgayDat DESC";

      // ✅ Thực thi truy vấn
      const [rows] = await db.execute(sql, params);

      console.log(`✅ Lấy ${rows.length} đơn đặt phòng cho KH #${userId}`);
      return rows;
    } catch (err) {
      console.error("❌ Lỗi SQL trong DonDatPhong.getAllByUser:", err.message);
      throw err; // ném lỗi để controller xử lý
    }
  },

  /**
   * Lấy chi tiết 1 đơn đặt phòng
   */
  getChiTietDon: async (maDon) => {
    try {
      const sql = `
        SELECT 
          dp.MaDon,
          dp.NgayDat,
          dp.NgayNhan,
          dp.NgayTra,
          dp.TrangThai,
          dp.TongTien,
          kh.HoTen,
          
          p.TenPhong,
          p.Gia,
          ncc.TenNCC,
          lp.TenLoai
        FROM dondatphong dp
        JOIN khachhang kh ON dp.MaKhachHang = kh.MaKhachHang
        LEFT JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
        LEFT JOIN phong p ON ctdp.MaPhong = p.MaPhong
        LEFT JOIN nhacungcap ncc ON p.MaNhaCungCap = ncc.MaNCC
        LEFT JOIN loaiphong lp ON p.MaLoai = lp.MaLoai
        WHERE dp.MaDon = ?
      `;
  
      const [rows] = await db.execute(sql, [maDon]);
      return rows;
    } catch (err) {
      console.error("❌ Lỗi SQL trong getChiTietDon:", err.message);
      throw err;
    }
  },
  /**
   * Cập nhật trạng thái đơn đặt phòng (VD: Hủy, Hoàn tất)
   */
  updateTrangThai: async (maDon, trangThai) => {
    try {
      const sql = `UPDATE dondatphong SET TrangThai = ? WHERE MaDon = ?`;
      const [result] = await db.execute(sql, [trangThai, maDon]);
      console.log(`✅ Cập nhật trạng thái đơn #${maDon} -> ${trangThai}`);
      return result;
    } catch (err) {
      console.error("❌ Lỗi SQL trong updateTrangThai:", err.message);
      throw err;
    }
  }
};

module.exports = DonDatPhong;
