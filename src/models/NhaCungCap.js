const dbPromise = require("../../config/db")
const Phong = require("./phong")
const DonDatPhong = require("./DonDatPhong")
const dayjs = require('dayjs');

const NhaCungCap = {
    // 🔹 Lấy tất cả nhà cung cấp
    async getAll() {
        const db = await dbPromise
        const [rows] = await db.execute("SELECT * FROM NhaCungCap")
        return rows
    },

    // 🔹 Lấy nhà cung cấp theo ID
    async getById(maNCC) {
        const db = await dbPromise
        const [rows] = await db.execute(
            "SELECT * FROM NhaCungCap WHERE MaNCC = ?",
            [maNCC]
        )
        return rows[0]
    },

    // 🔹 Lấy nhà cung cấp theo tài khoản (JOIN TaiKhoan)
    async getByTaiKhoan(maTK) {
        const db = await dbPromise
        const [rows] = await db.execute(
            `
      SELECT n.*
      FROM NhaCungCap n
      JOIN TaiKhoan t ON n.MaTaiKhoan = t.MaTaiKhoan
      WHERE t.MaTaiKhoan = ?
    `,
            [maTK]
        )
        return rows[0]
    },

    // 🔹 Tạo mới nhà cung cấp
    async create({
        MaTaiKhoan,
        TenNCC,
        LoaiNganHang,
        ThongTinThanhToan,
        LoaiHinh,
        GiayPhepKD,
        MaDiaChi,
    }) {
        const sql = `
            INSERT INTO NhaCungCap (MaTaiKhoan, TenNCC, LoaiNganHang, ThongTinThanhToan, LoaiHinh, GiayPhepKD, MaDiaChi)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            MaTaiKhoan,
            TenNCC,
            LoaiNganHang,
            ThongTinThanhToan,
            LoaiHinh,
            GiayPhepKD,
            MaDiaChi,
        ]
        const [result] = await dbPromise.execute(sql, values)
        return result
    },

    // 🔹 Cập nhật thông tin nhà cung cấp
    async update({
        MaNCC,
        TenNCC,
        ThongTinThanhToan,
        LoaiHinh,
        GiayPhepKD,
        TrangThai,
        MaDiaChi,
    }) {
        const db = await dbPromise
        const [result] = await db.execute(
            `
      UPDATE NhaCungCap
      SET TenNCC = ?, ThongTinThanhToan = ?, LoaiHinh = ?, GiayPhepKD = ?, TrangThai = ?, MaDiaChi = ?
      WHERE MaNCC = ?
    `,
            [
                TenNCC,
                ThongTinThanhToan,
                LoaiHinh,
                GiayPhepKD,
                TrangThai,
                MaDiaChi,
                MaNCC,
            ]
        )
        return result.affectedRows > 0
    },

    // 🔹 Xóa (hoặc vô hiệu hóa) nhà cung cấp
    async disable(maNCC) {
        const [result] = await dbPromise.execute(
            `
            UPDATE NhaCungCap SET TrangThai = 'Đã khóa' WHERE MaNCC = ?
            `,
            [maNCC]
        )
        return result.affectedRows > 0
    },
    async getTongSoPhong(maNCC) {
        try {
            const [rows] = await dbPromise.execute(
                `
                SELECT COUNT(*) AS TongSoPhong
                FROM phong p 
                LEFT JOIN nhacungcap n ON p.MaNhaCungCap = n.MaNCC 
                WHERE n.MaNCC = ?
                `,
                [maNCC]
            )
            return rows[0].TongSoPhong
        } catch (error) {
            console.error("Lỗi tính tổng số phòng:", error)
            return 0
        }
    },
    async getTongSoDonDatPhong(maNCC) {
        try {
            const [rows] = await dbPromise.execute(
                `
                SELECT DISTINCT COUNT(*) as TongSoDonDatPhong FROM DONDATPHONG D 
                JOIN CHITIETDONDATPHONG C ON D.MADON = C.MADON 
                WHERE C.MAPHONG IN (
                    SELECT MAPHONG FROM PHONG P 
                    WHERE MANHACUNGCAP = ?
                )
                `,
                [maNCC]
            )
            return rows[0].TongSoDonDatPhong
        } catch (error) {
            console.error("Lỗi tính số đơn đặt phòng:", error)
            return 0
        }
    },
    async getTongDoanhThu(maNCC) {
        /**
         * Tính tổng doanh thu từ các đơn đặt phòng liên quan đến nhà cung cấp
         * rủi ro 1 đơn đặt phòng có thể bao gồm nhiều phòng từ các nhà cung cấp khác nhau
         */
        try {
            const [rows] = await dbPromise.execute(
                `
                SELECT DISTINCT SUM(D.TongTien) AS DoanhThu FROM DONDATPHONG D 
                JOIN CHITIETDONDATPHONG C ON D.MADON = C.MADON 
                WHERE C.MAPHONG IN (
                    SELECT MAPHONG FROM PHONG P 
                    WHERE MANHACUNGCAP = ?
                ) AND D.TRANGTHAI = 2;
                `,
                [maNCC]
            )
            return rows[0].DoanhThu
        } catch (error) {
            console.error("Lỗi tính doanh thu:", error)
            return 0
        }
    },
    async getDoanhThuThangTheoNam(maNCC, nam) {
        /**
         * Tính doanh thu theo tháng cho nhà cung cấp
         */
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let doanhThuTheoThang = {};
        const d = new Date();
        let currentMonth = d.getMonth();
        // Khởi tạo tất cả các tháng với doanh thu 0
        for (let i = 0; i <= currentMonth; i++) {
            doanhThuTheoThang[months[i]] = 0;
        }
        try {
            const [rows] = await dbPromise.execute(
                `
                SELECT * FROM VIEW_NCC_DOANHTHU
                WHERE MANCC = ? AND NAM = ? ORDER BY THANG ASC;
                `,
                [maNCC, nam]
            )
            // Cập nhật doanh thu thực tế từ kết quả truy vấn
            for (let row of rows) {
                const monthName = months[row.THANG - 1]; // Giả sử THANG là số từ 1 đến 12
                doanhThuTheoThang[monthName] = row.DOANHTHU;
            }
            return doanhThuTheoThang;
        } catch (error) {
            console.error("Lỗi tính doanh thu:", error)
            return doanhThuTheoThang;
        }        
    },
    async getMaxDoanhThuTheoNam(maNCC, nam) {
        /**
         * Tính doanh thu cao nhất trong năm cho nhà cung cấp
         */
        try {
            let sql = `
                SELECT MAX(DOANHTHU) AS MAXDOANHTHU FROM VIEW_NCC_DOANHTHU
                WHERE MANCC = ? AND NAM = ?;
            `;
            let values = [maNCC, nam];
            const [rows] = await dbPromise.execute(sql, values)
            return rows[0].MAXDOANHTHU || 0
        }
        catch (error) {
            console.error("Lỗi tính doanh thu cao nhất:", error)
            return 0
        }
    },
    async getThongKePhong(maNCC) {
        /**
         * Thống kê số lượng phòng theo trạng thái cho nhà cung cấp
         */
        let rows = [];
        const allStatuses = Phong.getTrangThaiPhong();
        try {
            const [response] = await dbPromise.execute(
                `
                SELECT TINHTRANG, SUM(SOLUONG) AS SOLUONG FROM VIEW_NCC_PHONG
                WHERE MANCC = ?
                GROUP BY TINHTRANG;
                `,
                [maNCC]
            )
            if (response) rows = response;
        } catch (error) {
            console.error("Lỗi thống kê phòng:", error)
        }
        // Đảm bảo tất cả trạng thái đều có trong kết quả
        const result = {};
        for (let statusKey in allStatuses) {
            if (!rows.find(row => row.TINHTRANG == statusKey)) {
                result[allStatuses[statusKey]] = 0;
            } else {
                result[allStatuses[statusKey]] = rows.find(row => row.TINHTRANG == statusKey).SOLUONG;
            }
        }
        return result;
    },
    async getThongKeDonDatPhong(maNCC) {
        /**
         * Thống kê số lượng đơn đặt phòng theo trạng thái cho nhà cung cấp
         */
        let rows = [];
        const allStatuses = DonDatPhong.getTrangThaiDonDatPhong();
        try {
            const [response] = await dbPromise.execute(
                `
                SELECT TRANGTHAI, SOLUONG FROM VIEW_NCC_DONDATPHONG
                WHERE MANCC = ?
                `,
                [maNCC]
            )
            if (response) rows = response;
        } catch (error) {
            console.error("Lỗi thống kê đơn đặt phòng:", error)
        }
        // Đảm bảo tất cả trạng thái đều có trong kết quả
        const result = {};
        for (let statusKey in allStatuses) {
            if (!rows.find(row => row.TRANGTHAI == statusKey)) {
                result[allStatuses[statusKey]] = 0;
            } else {
                result[allStatuses[statusKey]] = rows.find(row => row.TRANGTHAI == statusKey).SOLUONG;
            }
        }
        return result;
    },
    async getDoanhThuThangTheoThang(maNCC, thang, nam) {
        /**
         * Thống kê doanh thu theo ngày trong tháng cho nhà cung cấp
         */
        let rows = [];
        const today = new Date();
        const month = thang; // 1–12

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const result = {};

        const daysInMonth = new Date(nam, thang, 0).getDate();

        // Initialize all days with 0 revenue
        // for (let day = 1; day <= daysInMonth; day++) {  
        //     result[`${monthNames[thang-1]} ${day}`] = 0;
        // }
        try {
            const [rows] = await dbPromise.execute(
                `
                SELECT DAY(D.NgayDat) AS NGAY, SUM(D.TongTien) AS DoanhThu FROM DONDATPHONG D 
                LEFT JOIN CHITIETDONDATPHONG C ON D.MADON = C.MADON
                LEFT JOIN PHONG P ON C.MAPHONG = P.MAPHONG
                LEFT JOIN NHACUNGCAP N ON P.MANHACUNGCAP = N.MANCC
                WHERE D.TRANGTHAI = 2 AND N.MANCC = ? AND YEAR(D.NgayDat) = ? AND MONTH(D.NgayDat) = ?
                GROUP BY DAY(D.NgayDat) ORDER BY DAY(D.NgayDat) ASC;
                `,
                [maNCC, nam, thang]
            )
            if (rows) {
                // Update actual revenue from query results
                for (let row of rows) {
                    const dayKey = `${monthNames[thang-1]} ${row.NGAY}`;
                    result[dayKey] = row.DoanhThu;
                }
            }
        }
        catch (error) {
            console.error("Lỗi tính doanh thu cao nhất:", error)
        }
        return result
    },
    async getMaxDoanhThuTheoThang(maNCC, thang, nam) {
        /**
         * Tính doanh thu cao nhất trong năm cho nhà cung cấp
         */
        try {
            const [rows] = await dbPromise.execute(
                `
                SELECT MAX(D.TongTien) AS MAXDOANHTHU FROM DONDATPHONG D 
                LEFT JOIN CHITIETDONDATPHONG C ON D.MADON = C.MADON
                LEFT JOIN PHONG P ON C.MAPHONG = P.MAPHONG
                LEFT JOIN NHACUNGCAP N ON P.MANHACUNGCAP = N.MANCC
                WHERE D.TRANGTHAI = 2 AND N.MANCC = ? AND MONTH(D.NgayDat) = ? AND YEAR(D.NgayDat) = ? 
                GROUP BY DAY(D.NgayDat) ORDER BY DAY(D.NgayDat) ASC;
                `,
                [maNCC, thang, nam]
            )
            return rows[0].MAXDOANHTHU || 0
        }
        catch (error) {
            console.error("Lỗi tính doanh thu cao nhất:", error)
            return 0
        }
    },
    // async getDanhSachDonDatPhong(maNCC, trangThai) {
    //     /**
    //      * Lấy danh sách đơn đặt phòng theo trạng thái cho nhà cung cấp
    //      */
    // }
}

// Đăng ký nhà cung cấp
// Thêm nha cung cap
// const addNhaCungCap = async (data, callback) => {
//     const sql = `
//     INSERT INTO NhaCungCap (MaTaiKhoan, TenNCC, LoaiNganHang, ThongTinThanhToan, LoaiHinh, GiayPhepKD, MaDiaChi)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `
//     const values = [
//         data.MaTaiKhoan,
//         data.TenNCC,
//         data.LoaiNganHang,
//         data.ThongTinThanhToan,
//         data.LoaiHinh,
//         data.GiayPhepKD,
//         data.MaDiaChi,
//     ]
//     const [result] = await dbPromise.execute(sql, values)
//     return result
// }

// module.exports = { NhaCungCap, addNhaCungCap }
module.exports = NhaCungCap
