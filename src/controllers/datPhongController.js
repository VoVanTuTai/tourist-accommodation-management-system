const DatPhong = require("../models/datphong");
const KhachHang = require("../models/khachhang");
const db = require("../../config/db");

// Hàm bổ trợ lấy ngày định dạng YYYY-MM-DD
function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

function tomorrowISO() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
}

// ======= Hiển thị form đặt phòng =======
exports.renderForm = async (req, res) => {
    try {
        const maPhong = req.params.maPhong;
        const room = await DatPhong.getRoomById(maPhong);
        const user = req.session.user || null;

        // Lấy ngày hiện tại theo giờ Việt Nam (ISO string lấy múi giờ UTC nên có thể bị lệch ngày nếu đặt muộn)
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(now - offset)).toISOString().slice(0, 10);
        
        // Ngày mai
        const tomorrow = new Date(now.getTime() + (24 * 60 * 60 * 1000) - offset);
        const nextDayISO = tomorrow.toISOString().slice(0, 10);

        // Đảm bảo object form luôn có dữ liệu ngày chuẩn
        const formData = {
            NgayNhan: localISOTime, // Ví dụ: 2023-10-27
            NgayTra: nextDayISO,    // Ví dụ: 2023-10-28
            MaPhong: maPhong
        };

        res.render("khachhang/datphong", {
            error: null,
            room: room,
            user: user,
            form: formData // Gửi formData này xuống EJS
        });
    } catch (e) {
        console.error("Lỗi renderForm:", e);
        res.render("khachhang/datphong", {
            error: "Lỗi hệ thống", 
            room: null, 
            user: req.session.user || null, 
            form: { NgayNhan: new Date().toISOString().slice(0, 10) }, 
        });
    }
};

// ======= Xem trước đơn đặt =======
exports.previewConfirm = async (req, res) => {
    try {
        const b = req.body;
        const user = req.session.user || null;
        const room = await DatPhong.getRoomById(b.MaPhong);

        if (!room) {
            return res.render("khachhang/datphong", { 
                error: "Không tìm thấy phòng", 
                room: null, 
                form: b, 
                user: user
            });
        }

        const soDem = Math.ceil((new Date(b.NgayTra) - new Date(b.NgayNhan)) / (1000 * 60 * 60 * 24));
        const tongTien = soDem * room.Gia;

        req.session.previewOrder = { ...b, TongTien: tongTien, SoDem: soDem };

        res.render("khachhang/xacnhan", {
            don: req.session.previewOrder,
            user: user,
        });
    } catch (e) {
        res.render("khachhang/datphong", { 
            error: "Lỗi preview", 
            room: null, 
            form: req.body, 
            user: req.session.user 
        });
    }
};

// ======= Xác nhận và lưu đơn =======
exports.confirmBooking = async (req, res) => {
    try {
        const preview = req.session.previewOrder;
        const user = req.session.user; 
        
        if (!preview) return res.redirect("/phong");
        if (!user) return res.redirect("/khachhang/dangnhap");

        const kh = await KhachHang.findByMaTK(user.MaTaiKhoan);
        if (!kh) {
            throw new Error("Tài khoản chưa có thông tin Khách Hàng.");
        }

        const payload = {
            MaKhachHang: kh.MaKhachHang,
            TenNguoiNhan: preview.Nhan_HoTen || user.HoTen,
            SDTNguoiNhan: preview.Nhan_SDT || user.SoDienThoai,
            NgayNhan: preview.NgayNhan,
            NgayTra: preview.NgayTra,
            TrangThai: '0', 
            TongTien: preview.TongTien
        };

        const newOrderId = await DatPhong.createOrder(payload); 

        await db.execute(
            "INSERT INTO chitietdondatphong (MaDon, MaPhong, Gia) VALUES (?, ?, ?)",
            [newOrderId, preview.MaPhong, payload.TongTien]
        );

        delete req.session.previewOrder;

        return res.render("khachhang/hoanthanh", { 
            maDon: newOrderId,              
            trangThai: payload.TrangThai, 
            tongTien: payload.TongTien,
            tenKhach: payload.TenNguoiNhan, // Tên người nhận phòng thực tế
            user: user 
        });

    } catch (e) {
        console.error("❌ Lỗi confirmBooking:", e);
        res.render("khachhang/datphong", { 
            error: "Lỗi lưu đơn: " + e.message, 
            room: null, 
            user: req.session.user || null,
            form: req.session.previewOrder || { NgayNhan: todayISO(), NgayTra: tomorrowISO() } 
        });
    }
};