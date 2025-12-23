const db = require("../../config/db")
const {getTrangThaiPhong}=require("./phong")

const DonDatPhong = {
    // 🧾 Danh sách đơn theo khách hàng
    async getAllByUser(maKhachHang, trangThai) {
        try {
            let sql = `
                SELECT 
                    dp.MaDon, dp.NgayDat, dp.NgayNhan, dp.NgayTra, 
                    dp.TrangThai, dp.TongTien,
                    COALESCE(ncc.TenNCC, 'Phòng đã đặt') AS TenChoO 
                FROM dondatphong dp
                LEFT JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
                LEFT JOIN phong p                ON ctdp.MaPhong = p.MaPhong
                LEFT JOIN nhacungcap ncc         ON p.MaNhaCungCap = ncc.MaNCC
                WHERE dp.MaKhachHang = ?
            `;
            
            const params = [maKhachHang];
            if (trangThai !== undefined && trangThai !== "") {
                sql += ` AND dp.TrangThai = ?`;
                params.push(trangThai);
            }
            sql += ` GROUP BY dp.MaDon ORDER BY dp.MaDon DESC`;
    
            const [rows] = await db.execute(sql, params);
            return rows;
        } catch (err) {
            console.error("❌ Lỗi Model:", err.message);
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
        dp.TenNguoiNhan,
        dp.SDTNguoiNhan,
  
        kh.HoTen AS TenKH,
        kh.Email,
        kh.SoDienThoai AS SDT,
  
        p.MaPhong,
        p.TenPhong,
        p.Gia AS GiaPhong,
        lp.TenLoai AS LoaiPhong,
        ncc.TenNCC AS TenChoO,
        p.HinhAnh,
  
        -- ⭐ THÔNG TIN THANH TOÁN
        tt.MaThanhToan,
        tt.NgayTT,
        tt.SoTien AS SoTienThanhToan,
  
        -- ⭐ TRẠNG THÁI THANH TOÁN (0 = chưa, 1 = đã thanh toán)
        CASE 
          WHEN tt.MaThanhToan IS NULL THEN 0
          ELSE 1
        END AS TrangThaiThanhToan
  
      FROM DonDatPhong dp
      LEFT JOIN KhachHang kh ON dp.MaKhachHang = kh.MaKhachHang
      LEFT JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
      LEFT JOIN Phong p ON ctdp.MaPhong = p.MaPhong
      LEFT JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
      LEFT JOIN NhaCungCap ncc ON p.MaNhaCungCap = ncc.MaNCC
  
      -- ⭐ JOIN BẢNG THANH TOÁN
      LEFT JOIN ThanhToan tt ON tt.MaDon = dp.MaDon
  
      WHERE dp.MaDon = ?
      LIMIT 1;
    `

        const [rows] = await db.execute(sql, [maDon])
        console.log("📦 getDonVaPhong result (FULL):", rows[0])
        return rows.length > 0 ? rows[0] : null
    },

    // 📑 Một đơn → nhiều dòng (mỗi dòng là 1 phòng trong đơn)
    // 📑 Một đơn → nhiều dòng (mỗi dòng 1 phòng)
    // async getChiTietDon(maDon) {
    //   const sql = `
    //     SELECT
    //       dp.MaDon,
    //       dp.NgayDat,
    //       dp.NgayNhan,
    //       dp.NgayTra,
    //       dp.TrangThai,
    //       dp.TongTien,
    //       kh.HoTen AS TenKH,
    //       kh.Email,
    //       kh.SoDienThoai AS SDT,
    //       p.MaPhong,
    //       p.TenPhong,
    //       p.Gia AS GiaApDung,
    //       lp.TenLoai AS LoaiPhong,
    //       ncc.TenNCC
    //     FROM DonDatPhong dp
    //     JOIN KhachHang kh ON dp.MaKhachHang = kh.MaKhachHang
    //     JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
    //     JOIN Phong p ON ctdp.MaPhong = p.MaPhong
    //     LEFT JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
    //     LEFT JOIN NhaCungCap ncc ON p.MaNhaCungCap = ncc.MaNCC
    //     WHERE dp.MaDon = ?
    //     ORDER BY p.MaPhong ASC
    //   `;
    //   const [rows] = await db.execute(sql, [maDon]);
    //   return rows;
    // },
    updateTrangThai: async (maDon, trangThai) => {
        const sql = `
      UPDATE dondatphong 
      SET TrangThai = ? 
      WHERE MaDon = ?
    `

        const [result] = await db.execute(sql, [trangThai, maDon])

        // result.affectedRows == 0 → đơn không tồn tại
        return result.affectedRows > 0
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
    `
        const [rows] = await db.execute(sql, [maDon])
        return rows
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
    `
        const [rows] = await db.execute(sql, [maDon])
        return rows[0]
    },
    // models/DonDatPhong.js (BỔ SUNG)

    // models/DonDatPhong.js (Phương thức GỘP MỚI)
    async getAllByNCC(maNCC, trangThai, searchMaDon) {
        // ✅ Bổ sung tham số searchMaDon
        try {
            // Câu lệnh SQL cơ bản, lọc theo MaNCC (là điều kiện bắt buộc)
            let sql = `
            SELECT 
                dp.MaDon, dp.NgayDat, dp.NgayNhan, dp.NgayTra, 
                dp.TrangThai, dp.TongTien, dp.TenNguoiNhan, dp.SDTNguoiNhan,
                dp.MaKhachHang, 
                kh.HoTen AS TenKhachHang,
                COALESCE(GROUP_CONCAT(DISTINCT p.TenPhong SEPARATOR ', '), 'Chưa rõ') AS DanhSachPhong
            FROM DonDatPhong dp
            JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
            JOIN Phong p ON ctdp.MaPhong = p.MaPhong
            JOIN KhachHang kh ON dp.MaKhachHang = kh.MaKhachHang
            WHERE p.MaNhaCungCap = ? 
        `

            const params = [maNCC] // Khởi tạo mảng tham số với maNCC bắt buộc

            // ⭐ 1. LOGIC LỌC THEO TRẠNG THÁI (trangThai)
            // Kiểm tra nếu tham số trangThai tồn tại và không phải là chuỗi rỗng
            if (trangThai !== undefined && trangThai !== "") {
                sql += ` AND dp.TrangThai = ?`
                // Chuyển sang kiểu số trước khi thêm vào tham số
                params.push(Number(trangThai))
            }

            // ⭐ 2. LOGIC TÌM KIẾM THEO MÃ ĐƠN (searchMaDon)
            // Kiểm tra nếu tham số searchMaDon tồn tại và có thể chuyển thành số
            if (searchMaDon && !isNaN(Number(searchMaDon))) {
                sql += ` AND dp.MaDon = ?`
                params.push(Number(searchMaDon))
            }

            // Đóng câu lệnh SQL với GROUP BY và ORDER BY
            sql += `
            GROUP BY dp.MaDon
            ORDER BY dp.NgayDat DESC
        `

            // Thực thi truy vấn với mảng tham số được xây dựng động
            const [rows] = await db.execute(sql, params)
            return rows
        } catch (err) {
            console.error("❌ Lỗi SQL DonDatPhong.getAllByNCC:", err.message)
            throw err
        }
    },
    // 🔎 Chi tiết đơn đặt phòng và các phòng trong đơn, kiểm tra MaNCC
    // src/models/DonDatPhong.js (SỬA LẠI HÀM)

    // src/models/DonDatPhong.js (Trong hàm getChiTietDonVaPhongChoNCC)

    async getChiTietDonVaPhongChoNCC(maDon, maNCC) {
        try {
            const sqlDon = `
          SELECT
              dp.*, 
              kh.HoTen AS TenKH, 
              kh.Email, 
              kh.SoDienThoai AS SDT,
              tt.MaThanhToan, 
              tt.NgayTT, 
              tt.SoTien AS SoTienThanhToan
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

            // TRUY VẤN 2: Lấy danh sách chi tiết các phòng
            const chiTietPhong = await this.getDanhSachPhongTheoDon(maDon)

            // Gộp kết quả
            return {
                donDat: donDat[0],
                chiTietPhong: chiTietPhong,
            }
        } catch (err) {
            console.error(
                "❌ Lỗi SQL DonDatPhong.getChiTietDonVaPhongChoNCC:",
                err.message
            )
            throw err
        }
    },
    getTrangThaiDonDatPhong() {
        return {
            0: "Đã Đặt",
            1: "Đang Sử Dụng",
            2: "Đã Hoàn Tất",
            3: "Đã Hủy",
            4: "Chờ xác nhận", // Chờ thanh toán
            5: "Đã Thanh Toán",
        };
    }
}

module.exports = DonDatPhong
