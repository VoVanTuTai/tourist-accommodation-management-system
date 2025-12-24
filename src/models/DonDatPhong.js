const db = require("../../config/db")
const {getTrangThaiPhong}=require("./phong")

const DonDatPhong = {
    // 🧾 Danh sách đơn theo khách hàng - Cập nhật để hiển thị tốt hơn
async getAllByUser(maKhachHang, trangThai) {
    try {
        let sql = `
            SELECT 
                dp.MaDon, dp.NgayDat, dp.NgayNhan, dp.NgayTra, 
                dp.TrangThai, dp.TongTien,
                -- Lấy tên phòng đầu tiên trong đơn để hiển thị làm đại diện
                COALESCE(MIN(p.TenPhong), 'Phòng đã đặt') AS TenPhong,
                COALESCE(MIN(ncc.TenNCC), 'Chưa xác định') AS TenChoO 
            FROM dondatphong dp
            LEFT JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
            LEFT JOIN phong p                ON ctdp.MaPhong = p.MaPhong
            LEFT JOIN nhacungcap ncc         ON p.MaNhaCungCap = ncc.MaNCC
            WHERE dp.MaKhachHang = ?
        `;
        
        const params = [maKhachHang];
        // Kiểm tra kỹ trangThai để tránh bị lọc nhầm
        if (trangThai !== undefined && trangThai !== null && trangThai !== "") {
            sql += ` AND dp.TrangThai = ?`;
            params.push(trangThai);
        }
        
        sql += ` GROUP BY dp.MaDon ORDER BY dp.MaDon DESC`;

        const [rows] = await db.execute(sql, params);
        return rows;
    } catch (err) {
        console.error("❌ Lỗi Model getAllByUser:", err.message);
        throw err;
    }
},

    // 📋 Chi tiết đơn & thông tin phòng (ĐÃ SỬA COALESCE)
    // Tìm đến hàm getDonVaPhong trong DonDatPhong.js và thay thế phần SELECT
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
        dp.TenNguoiNhan, -- Đây là người nhận phòng (nhập lúc đặt)
        dp.SDTNguoiNhan,
  
        kh.HoTen AS TenKhachHangDat, -- Tên chủ tài khoản (Người đặt)
        kh.Email,
        kh.SoDienThoai AS SDT,
  
        p.MaPhong,
        p.TenPhong,
        p.Gia AS GiaPhong,
        lp.TenLoai AS LoaiPhong,
        ncc.TenNCC AS TenChoO,
        p.HinhAnh,
  
        tt.MaThanhToan,
        tt.NgayTT,
        tt.SoTien AS SoTienThanhToan,
  
        CASE 
          WHEN tt.MaThanhToan IS NULL THEN 0
          ELSE 1
        END AS TrangThaiThanhToan
  
      FROM dondatphong dp -- Đảm bảo viết đúng chữ thường nếu DB của bạn là dondatphong
      LEFT JOIN khachhang kh ON dp.MaKhachHang = kh.MaKhachHang
      LEFT JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
      LEFT JOIN phong p ON ctdp.MaPhong = p.MaPhong
      LEFT JOIN loaiphong lp ON p.MaLoai = lp.MaLoai
      LEFT JOIN nhacungcap ncc ON p.MaNhaCungCap = ncc.MaNCC
      LEFT JOIN thanhtoan tt ON tt.MaDon = dp.MaDon
  
      WHERE dp.MaDon = ?
      LIMIT 1;
    `;
    const [rows] = await db.execute(sql, [maDon]);
    return rows.length > 0 ? rows[0] : null;
},

    async updateTrangThai(maDon, trangThai) {
        const sql = `UPDATE dondatphong SET TrangThai = ? WHERE MaDon = ?`
        const [result] = await db.execute(sql, [trangThai, maDon])
        return result.affectedRows > 0
    },

    async getDanhSachPhongTheoDon(maDon) {
        const sql = `
      SELECT 
        p.MaPhong, p.TenPhong,
        COALESCE(ctdp.Gia, p.Gia) AS Gia,
        p.SucChua, p.HinhAnh,
        lp.TenLoai AS LoaiPhong,
        ncc.TenNCC AS TenChoO
      FROM chitietdondatphong ctdp
      JOIN Phong p ON ctdp.MaPhong = p.MaPhong
      LEFT JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
      LEFT JOIN NhaCungCap ncc ON p.MaNhaCungCap = ncc.MaNCC
      WHERE ctdp.MaDon = ?
      ORDER BY p.MaPhong ASC
    `
        const [rows] = await db.execute(sql, [maDon])
        return rows
    },

    async getThongTinThanhToan(maDon) {
        const sql = `
      SELECT 
        dp.MaDon, dp.NgayDat, dp.NgayNhan, dp.NgayTra, dp.TongTien,
        ncc.MaNCC,
        COALESCE(GROUP_CONCAT(DISTINCT ncc.TenNCC ORDER BY ncc.TenNCC SEPARATOR ', '), 'Chưa rõ') AS TenNCC,
        COALESCE(GROUP_CONCAT(DISTINCT ncc.ThongTinThanhToan ORDER BY ncc.ThongTinThanhToan SEPARATOR ' | '), '') AS ThongTinThanhToan,
        COALESCE(GROUP_CONCAT(DISTINCT CONCAT_WS(', ', d.ChiTiet, x.TenXa, t.TenTinh) ORDER BY d.ChiTiet SEPARATOR ' | '), '') AS DiaChiNCC
      FROM DonDatPhong dp
      LEFT JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
      LEFT JOIN Phong p ON ctdp.MaPhong = p.MaPhong
      LEFT JOIN NhaCungCap ncc ON p.MaNhaCungCap = ncc.MaNCC
      LEFT JOIN DiaChi d ON ncc.MaDiaChi = d.MaDiaChi
      LEFT JOIN Xa x ON d.MaXa = x.MaXa
      LEFT JOIN Tinh t ON x.MaTinh = t.MaTinh
      WHERE dp.MaDon = ?
      GROUP BY dp.MaDon
      LIMIT 1
    `
        const [rows] = await db.execute(sql, [maDon])
        return rows[0]
    },

    async getAllByNCC(maNCC, trangThai, searchMaDon) {
        try {
            let sql = `
            SELECT 
                dp.MaDon, dp.NgayDat, dp.NgayNhan, dp.NgayTra, 
                dp.TrangThai, dp.TongTien, dp.TenNguoiNhan, dp.SDTNguoiNhan,
                dp.MaKhachHang, kh.HoTen AS TenKhachHang,
                COALESCE(GROUP_CONCAT(DISTINCT p.TenPhong SEPARATOR ', '), 'Chưa rõ') AS DanhSachPhong
            FROM DonDatPhong dp
            JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
            JOIN Phong p ON ctdp.MaPhong = p.MaPhong
            JOIN KhachHang kh ON dp.MaKhachHang = kh.MaKhachHang
            WHERE p.MaNhaCungCap = ? 
        `
            const params = [maNCC]
            if (trangThai !== undefined && trangThai !== "") {
                sql += ` AND dp.TrangThai = ?`
                params.push(trangThai)
            }
            if (searchMaDon && !isNaN(Number(searchMaDon))) {
                sql += ` AND dp.MaDon = ?`
                params.push(Number(searchMaDon))
            }
            sql += ` GROUP BY dp.MaDon ORDER BY dp.NgayDat DESC`
            const [rows] = await db.execute(sql, params)
            return rows
        } catch (err) {
            console.error("❌ Lỗi SQL DonDatPhong.getAllByNCC:", err.message)
            throw err
        }
    },

    async getChiTietDonVaPhongChoNCC(maDon, maNCC) {
        try {
            const sqlDon = `
          SELECT
              dp.*, kh.HoTen AS TenKH, kh.Email, kh.SoDienThoai AS SDT,
              tt.MaThanhToan, tt.NgayTT, tt.SoTien AS SoTienThanhToan
          FROM DonDatPhong dp
          JOIN KhachHang kh ON dp.MaKhachHang = kh.MaKhachHang
          LEFT JOIN ThanhToan tt ON tt.MaDon = dp.MaDon
          WHERE dp.MaDon = ?
          AND EXISTS ( 
              SELECT 1 FROM chitietdondatphong ctdp 
              JOIN Phong p ON ctdp.MaPhong = p.MaPhong 
              WHERE ctdp.MaDon = dp.MaDon AND p.MaNhaCungCap = ?
          )
          LIMIT 1;
      `
            const [donDat] = await db.execute(sqlDon, [maDon, maNCC])
            if (donDat.length === 0) return null
            const chiTietPhong = await this.getDanhSachPhongTheoDon(maDon)
            return { donDat: donDat[0], chiTietPhong: chiTietPhong }
        } catch (err) {
            console.error("❌ Lỗi SQL DonDatPhong.getChiTietDonVaPhongChoNCC:", err.message)
            throw err
        }
    },

    getTrangThaiDonDatPhong() {
        return { 0: "Đã Đặt", 1: "Đang Sử Dụng", 2: "Đã Hoàn Tất", 3: "Đã Hủy", 4: "Chờ xác nhận", 5: "Đã Thanh Toán" };
    }
}

module.exports = DonDatPhong