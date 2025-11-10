const db = require("../../config/db");

const DonDatPhong = {
  // 🧾 Danh sách đơn theo khách hàng; gộp tên chỗ ở theo đơn
  async getAllByUser(maKhachHang, trangThai) {
    try {
      let sql = `
        SELECT 
          dp.MaDon,
          dp.NgayDat,
          dp.NgayNhan,
          dp.NgayTra,
          dp.TrangThai,
          dp.TongTien,
          COALESCE(GROUP_CONCAT(DISTINCT ncc.TenNCC SEPARATOR ', '), 'Chưa rõ') AS TenChoO
        FROM DonDatPhong dp
        LEFT JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
        LEFT JOIN Phong p                ON ctdp.MaPhong = p.MaPhong
        LEFT JOIN NhaCungCap ncc         ON p.MaNhaCungCap = ncc.MaNCC
        WHERE dp.MaKhachHang = ?
      `;
      const params = [maKhachHang];

      if (trangThai !== undefined && trangThai !== "") {
        sql += ` AND dp.TrangThai = ?`;
        params.push(Number(trangThai));
      }

      sql += `
        GROUP BY dp.MaDon
        ORDER BY dp.NgayDat DESC
      `;

      const [rows] = await db.execute(sql, params);
      return rows;
    } catch (err) {
      console.error("❌ Lỗi SQL DonDatPhong.getAllByUser:", err.message);
      throw err;
    }
  },

  // 📋 Chi tiết đơn & thông tin phòng
  async getDonVaPhong(maDon) {
    const sql = `
      SELECT 
        dp.MaDon,
        dp.MaKhachHang,
        dp.NgayDat,
        dp.NgayNhan,
        dp.NgayTra,
        dp.TrangThai,
        dp.TongTien,
        
        kh.HoTen AS TenKH,
        kh.Email,
        kh.SoDienThoai AS SDT,
  
        p.MaPhong,
        p.TenPhong,
        p.Gia AS GiaPhong,        -- ✅ alias rõ ràng, không thể nhầm
        lp.TenLoai AS LoaiPhong,
        ncc.TenNCC AS TenChoO,
        p.HinhAnh                 -- ✅ lấy ảnh nếu có
        
      FROM DonDatPhong dp
      JOIN KhachHang kh ON dp.MaKhachHang = kh.MaKhachHang
      JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
      JOIN Phong p ON ctdp.MaPhong = p.MaPhong
      LEFT JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
      LEFT JOIN NhaCungCap ncc ON p.MaNhaCungCap = ncc.MaNCC
      WHERE dp.MaDon = ?
    `;
    const [rows] = await db.execute(sql, [maDon]);
    console.log("📦 getDonVaPhong result:", rows[0]); // 👀 in ra để debug
    return rows.length > 0 ? rows[0] : null;
  },

  // 📑 Một đơn → nhiều dòng (mỗi dòng là 1 phòng trong đơn)
  // 📑 Một đơn → nhiều dòng (mỗi dòng 1 phòng)
  async getChiTietDon(maDon) {
    const sql = `
      SELECT 
        dp.MaDon,
        dp.NgayDat,
        dp.NgayNhan,
        dp.NgayTra,
        dp.TrangThai,
        dp.TongTien,
        kh.HoTen AS TenKH,
        kh.Email,
        kh.SoDienThoai AS SDT,
        p.MaPhong,
        p.TenPhong,
        p.Gia AS GiaApDung,
        lp.TenLoai AS LoaiPhong,
        ncc.TenNCC
      FROM DonDatPhong dp
      JOIN KhachHang kh ON dp.MaKhachHang = kh.MaKhachHang
      JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
      JOIN Phong p ON ctdp.MaPhong = p.MaPhong
      LEFT JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
      LEFT JOIN NhaCungCap ncc ON p.MaNhaCungCap = ncc.MaNCC
      WHERE dp.MaDon = ?
      ORDER BY p.MaPhong ASC
    `;
    const [rows] = await db.execute(sql, [maDon]);
    return rows;
  },


  // 🏨 Danh sách phòng thuộc 1 đơn (gọn để dùng cho dropdown đánh giá)
  async getDanhSachPhongTheoDon(maDon) {
    const sql = `
      SELECT 
        p.MaPhong,
        p.TenPhong,
        COALESCE(ctdp.Gia, p.Gia) AS Gia,
        p.SucChua,
        p.HinhAnh,
        lp.TenLoai AS LoaiPhong,
        ncc.TenNCC AS TenChoO
      FROM chitietdondatphong ctdp
      JOIN Phong p        ON ctdp.MaPhong = p.MaPhong
      LEFT JOIN LoaiPhong lp  ON p.MaLoai = lp.MaLoai
      LEFT JOIN NhaCungCap ncc ON p.MaNhaCungCap = ncc.MaNCC
      WHERE ctdp.MaDon = ?
      ORDER BY p.MaPhong ASC
    `;
    const [rows] = await db.execute(sql, [maDon]);
    return rows;
  },

  // 💳 Gộp thông tin thanh toán/địa chỉ theo đơn (nếu cần dùng riêng)
  async getThongTinThanhToan(maDon) {
    const sql = `
      SELECT 
        dp.MaDon,
        dp.NgayDat,
        dp.NgayNhan,
        dp.NgayTra,
        dp.TongTien,
        ncc.MaNCC,  -- ✅ thêm dòng này
        COALESCE(GROUP_CONCAT(DISTINCT ncc.TenNCC ORDER BY ncc.TenNCC SEPARATOR ', '), 'Chưa rõ') AS TenNCC,
        COALESCE(GROUP_CONCAT(DISTINCT ncc.ThongTinThanhToan ORDER BY ncc.ThongTinThanhToan SEPARATOR ' | '), '') AS ThongTinThanhToan,
        COALESCE(GROUP_CONCAT(DISTINCT CONCAT_WS(', ', d.ChiTiet, x.TenXa, t.TenTinh) ORDER BY d.ChiTiet SEPARATOR ' | '), '') AS DiaChiNCC
      FROM DonDatPhong dp
      LEFT JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
      LEFT JOIN Phong p                ON ctdp.MaPhong = p.MaPhong
      LEFT JOIN NhaCungCap ncc         ON p.MaNhaCungCap = ncc.MaNCC
      LEFT JOIN DiaChi d               ON ncc.MaDiaChi = d.MaDiaChi
      LEFT JOIN Xa x                   ON d.MaXa = x.MaXa
      LEFT JOIN Tinh t                 ON x.MaTinh = t.MaTinh
      WHERE dp.MaDon = ?
      GROUP BY dp.MaDon
      LIMIT 1
    `;
    const [rows] = await db.execute(sql, [maDon]);
    return rows[0];
  }
  
};

module.exports = DonDatPhong;
