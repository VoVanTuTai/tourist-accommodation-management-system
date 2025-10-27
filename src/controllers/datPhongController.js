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
    const room = await DatPhong.getRoomById(b.MaPhong);

    // Kiểm tra ngày
    if (new Date(b.NgayNhan) < new Date(todayISO()))
      return res.render("khachhang/datphong", { error: "Ngày nhận phải >= hôm nay", room, form: b });

    if (new Date(b.NgayTra) <= new Date(b.NgayNhan))
      return res.render("khachhang/datphong", { error: "Ngày trả phải > ngày nhận", room, form: b });

    // Validate người đặt
    if (!reName.test(b.Dat_HoTen))
      return res.render("khachhang/datphong", { error: "Tên người đặt không hợp lệ", room, form: b });
    if (!rePhone.test(b.Dat_SDT))
      return res.render("khachhang/datphong", { error: "Số điện thoại người đặt không hợp lệ", room, form: b });
    if (!reCCCD.test(b.Dat_CCCD))
      return res.render("khachhang/datphong", { error: "CCCD người đặt không hợp lệ", room, form: b });

    // Validate người nhận
    if (!reName.test(b.Nhan_HoTen))
      return res.render("khachhang/datphong", { error: "Tên người nhận không hợp lệ", room, form: b });
    if (!rePhone.test(b.Nhan_SDT))
      return res.render("khachhang/datphong", { error: "Số điện thoại người nhận không hợp lệ", room, form: b });
    if (!reCCCD.test(b.Nhan_CCCD))
      return res.render("khachhang/datphong", { error: "CCCD người nhận không hợp lệ", room, form: b });

    // ✅ Tính tiền
    const soDem = Math.ceil(
      (new Date(b.NgayTra) - new Date(b.NgayNhan)) / (1000 * 60 * 60 * 24)
    );
    const tongTien = soDem * room.Gia;

    // Lưu dữ liệu tạm vào session để xác nhận
    req.session.previewOrder = {
      ...b,
      TongTien: tongTien,
      SoDem: soDem,
    };

    res.render("khachhang/xacnhan", {
      don: req.session.previewOrder, // ✅ truyền đúng biến sang EJS
      user: req.session.user || null,
    });
  } catch (e) {
    console.error("❌ Lỗi previewConfirm:", e);
    res.render("khachhang/datphong", { error: "Không thể xem trước đơn", room: null, form: {} });
  }
};

// ======= Xác nhận và lưu đơn =======
exports.confirmBooking = async (req, res) => {
  try {
    const preview = req.session.previewOrder;
    if (!preview) {
      return res.render("khachhang/xacnhan", { don: null, user: req.session.user || null });
    }

    const payload = {
      MaKhachHang: req.session.user?.MaTaiKhoan, // ✅ Lấy từ session
      MaPhong: preview.MaPhong,
      NgayNhan: preview.NgayNhan,
      NgayTra: preview.NgayTra,
      TongTien: preview.TongTien,

      Dat_HoTen: preview.Dat_HoTen,
      Dat_SDT: preview.Dat_SDT,
      Dat_CCCD: preview.Dat_CCCD,
      Dat_NgaySinh: preview.Dat_NgaySinh,
      Dat_GioiTinh: preview.Dat_GioiTinh,

      Nhan_HoTen: preview.Nhan_HoTen,
      Nhan_SDT: preview.Nhan_SDT,
      Nhan_CCCD: preview.Nhan_CCCD,
      Nhan_NgaySinh: preview.Nhan_NgaySinh,
      Nhan_GioiTinh: preview.Nhan_GioiTinh,
    };

    const newOrderId = await DatPhong.createOrder(payload);

    // Lưu đơn mới vào session để hiện xác nhận
    req.session.newOrder = {
      MaDon: newOrderId,
      TrangThai: "Chưa thanh toán",
      TongTien: payload.TongTien,
    };

    res.render("khachhang/xacnhan", {
      don: req.session.newOrder, // ✅ gửi sang view
      user: req.session.user || null,
    });
  } catch (e) {
    console.error("❌ Lỗi confirmBooking:", e);
    res.render("khachhang/datphong", { error: "Không thể lưu đơn đặt phòng", room: null, form: {} });
  }
};
