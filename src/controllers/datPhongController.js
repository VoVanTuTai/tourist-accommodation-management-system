const DatPhong = require("../models/datphong");

// Regex kiểm tra đầu vào
const reName = /^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)*$/;
const rePhone = /^0\d{9}$/;
const reCCCD = /^0\d{11}$/;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ======= Hiển thị form đặt phòng =======
exports.renderForm = async (req, res) => {
  try {
    const maPhong = req.params.maPhong;
    const room = await DatPhong.getRoomById(maPhong);

    if (!room)
      return res.render("khachhang/datphong", { error: "Không tìm thấy phòng", room: null, form: {} });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    res.render("khachhang/datphong", {
      error: null,
      room,
      form: {
        NgayNhan: todayISO(),
        NgayTra: tomorrow.toISOString().slice(0, 10),
      },
    });
  } catch (e) {
    console.error(e);
    res.render("khachhang/datphong", {
      error: "Có lỗi xảy ra khi hiển thị form",
      room: null,
      form: {},
    });
  }
};

// ======= Xem trước đơn đặt =======
exports.previewConfirm = async (req, res) => {
  try {
    const b = req.body;
    // 1. LUÔN LUÔN lấy thông tin phòng trước khi làm bất cứ việc gì khác
    const room = await DatPhong.getRoomById(b.MaPhong);

    if (!room) {
        return res.render("khachhang/datphong", { 
            error: "Không tìm thấy thông tin phòng. Vui lòng thử lại.", 
            room: null, 
            form: b 
        });
    }

    // 2. Kiểm tra ngày...
    if (new Date(b.NgayNhan) < new Date(todayISO()))
      return res.render("khachhang/datphong", { error: "Ngày nhận phải >= hôm nay", room, form: b });

    // ... (Các đoạn kiểm tra reName, rePhone, reCCCD giữ nguyên) ...
    // Đảm bảo tất cả các chỗ res.render("khachhang/datphong", ...) ĐỀU CÓ biến room truyền vào.

    // 3. Tính tiền và lưu session (giữ nguyên đoạn cũ của bạn)
    const soDem = Math.ceil((new Date(b.NgayTra) - new Date(b.NgayNhan)) / (1000 * 60 * 60 * 24));
    const tongTien = soDem * room.Gia;

    req.session.previewOrder = { ...b, TongTien: tongTien, SoDem: soDem };

    res.render("khachhang/xacnhan", {
      don: req.session.previewOrder,
      user: req.session.user || null,
    });
  } catch (e) {
    console.error("❌ Lỗi previewConfirm:", e);
    res.render("khachhang/datphong", { error: "Lỗi hệ thống", room: null, form: {} });
  }
};
// ======= Xác nhận và lưu đơn =======
exports.confirmBooking = async (req, res) => {
  try {
    const preview = req.session.previewOrder;
    if (!preview) return res.redirect("/phong");

    const payload = {
      MaKhachHang: req.session.user?.MaTaiKhoan || 19, 
      MaPhong: preview.MaPhong, // Đảm bảo preview.MaPhong có giá trị
      TenNguoiNhan: preview.Nhan_HoTen,
      SDTNguoiNhan: preview.Nhan_SDT,
      NgayNhan: preview.NgayNhan,
      NgayTra: preview.NgayTra,
      TrangThai: 'Chưa thanh toán',
      TongTien: preview.TongTien
    };

    // Bước 1: Lưu vào DB và hứng ID trả về vào biến newOrderId
    const newOrderId = await DatPhong.createOrder(payload); 

    // Bước 2: Xóa session sau khi lưu thành công
    delete req.session.previewOrder;

    // Bước 3: Render trang hoàn thành
    // Ở đây dùng đúng tên biến newOrderId đã khai báo ở trên
    return res.render("khachhang/hoanthanh", { 
        maDon: newOrderId,               
        trangThai: payload.TrangThai, 
        tongTien: payload.TongTien, 
        user: req.session.user || null
    });

  } catch (e) {
    console.error("❌ Lỗi confirmBooking:", e);
    
    // Phòng hờ lỗi: Lấy lại thông tin phòng để render lại trang đặt phòng nếu thất bại
    const room = await DatPhong.getRoomById(req.session.previewOrder?.MaPhong);
    
    res.render("khachhang/datphong", { 
        error: "Không thể lưu đơn: " + e.message, 
        room: room, 
        form: req.session.previewOrder || {} 
    });
  }
};
