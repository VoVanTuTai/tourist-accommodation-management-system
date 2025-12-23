const DatPhong = require("../models/datphong");

function todayISO() {
    return new Date().toISOString().slice(0, 10);
}

// ======= Hiển thị form đặt phòng =======
exports.renderForm = async (req, res) => {
    try {
        const maPhong = req.params.maPhong;
        const room = await DatPhong.getRoomById(maPhong);
        const user = req.session.user || null;

        if (!room) {
            return res.render("khachhang/datphong", { 
                error: "Không tìm thấy phòng", room: null, form: {}, user: user 
            });
        }

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        res.render("khachhang/datphong", {
            error: null,
            room: room,
            user: user,
            form: {
                NgayNhan: todayISO(),
                NgayTra: tomorrow.toISOString().slice(0, 10),
            },
        });
    } catch (e) {
        console.error("Lỗi renderForm:", e);
        res.render("khachhang/datphong", {
            error: "Lỗi hệ thống", room: null, user: req.session.user || null, form: {},
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
                error: "Không tìm thấy phòng", room: null, form: b, user: user
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
        res.render("khachhang/datphong", { error: "Lỗi preview", room: null, form: req.body, user: req.session.user });
    }
};

// ======= Xác nhận và lưu đơn =======
exports.confirmBooking = async (req, res) => {
    try {
        const preview = req.session.previewOrder;
        const user = req.session.user; 
        
        if (!preview) return res.redirect("/phong");

        const payload = {
            // Sửa MaTaiKhoan để khớp với session của bạn (ID 19)
            MaKhachHang: user ? user.MaTaiKhoan : null, 
            TenNguoiNhan: preview.Nhan_HoTen,
            SDTNguoiNhan: preview.Nhan_SDT,
            NgayNhan: preview.NgayNhan,
            NgayTra: preview.NgayTra,
            TrangThai: 'Chưa thanh toán',
            TongTien: preview.TongTien
        };

        const newOrderId = await DatPhong.createOrder(payload); 
        delete req.session.previewOrder;

        return res.render("khachhang/hoanthanh", { 
            maDon: newOrderId,              
            trangThai: payload.TrangThai, 
            tongTien: payload.TongTien, 
            user: user
        });

    } catch (e) {
        console.error("❌ Lỗi confirmBooking:", e);
        res.render("khachhang/datphong", { 
            error: "Lỗi lưu đơn: " + e.message, 
            room: null, 
            user: req.session.user || null,
            form: req.session.previewOrder || {} 
        });
    }
};