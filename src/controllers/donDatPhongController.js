const db = require("../../config/db");
const DonDatPhong = require("../models/DonDatPhong");
const DanhGia = require("../models/DanhGia");
const KhachHang = require("../models/KhachHang");
// =====================================================
// 🧾 DANH SÁCH ĐƠN ĐẶT PHÒNG CỦA KHÁCH HÀNG
// =====================================================
exports.danhSachDonDatPhong = async (req, res) => {
  try {
    // 1. Kiểm tra đăng nhập
    if (!req.session.user) return res.redirect("/khachhang/dangnhap");
    
    const idTaiKhoan = req.session.user.MaTaiKhoan;
    console.log("🔍 Đang kiểm tra đơn cho MaTaiKhoan:", idTaiKhoan);

    // 2. Lấy MaKhachHang chuẩn từ DB dựa trên tài khoản đang đăng nhập
    const [khRows] = await db.execute(
      "SELECT MaKhachHang FROM khachhang WHERE MaTaiKhoan = ?",
      [idTaiKhoan]
    );

    if (khRows.length === 0) {
      console.error("❌ Tài khoản này chưa có thông tin trong bảng khách hàng");
      return res.render("khachhang/danhsachdondatphong", {
        donDatPhongList: [],
        trangThai: req.query.trangthai || "",
        user: req.session.user
      });
    }

    const maKhachHangThuc = khRows[0].MaKhachHang;
    const trangThai = req.query.trangthai || "";
    
    console.log("🔍 MaKhachHang tìm thấy trong DB:", maKhachHangThuc);

    // 3. Lấy danh sách đơn bằng MaKhachHang THẬT
    const donDatPhongList = await DonDatPhong.getAllByUser(maKhachHangThuc, trangThai);
    
    console.log(`🔍 Kết quả: Tìm thấy ${donDatPhongList.length} đơn cho khách hàng #${maKhachHangThuc}`);

    // 4. Trả về giao diện (Giữ nguyên phần render của bạn)
    res.render("khachhang/danhsachdondatphong", {
      donDatPhongList: donDatPhongList,
      trangThai,
      user: req.session.user,
      js: ["/js/khachhang/danhsachdondatphong"],
      css: ["/css/danhsachdondatphong.css"],
    });

  } catch (err) {
    console.error("❌ Lỗi nghiêm trọng:", err);
    res.status(500).send("Lỗi server!");
  }
};
// =====================================================
// 📋 CHI TIẾT ĐƠN ĐẶT PHÒNG
// =====================================================


exports.chiTietDonDatPhong = async (req, res) => {
  try {
    const maDon = req.params.id;
    const don = await DonDatPhong.getDonVaPhong(maDon);

    // Nếu không tìm thấy đơn, chuyển hướng về danh sách và báo lỗi
    if (!don) {
      req.flash("error", "Không tìm thấy thông tin đơn đặt phòng này.");
      return res.redirect("/khachhang/don-dat-phong");
    }

    const order = await DonDatPhong.getThongTinThanhToan(maDon);
    let danhGia = null;
    if (don.MaPhong) {
        danhGia = await DanhGia.getByUserAndPhong(don.MaKhachHang, don.MaPhong);
    }

    res.render("khachhang/chitietdondatphong", {
      don, // Lúc này chắc chắn 'don' không còn null
      order,
      daDanhGia: !!danhGia,
      danhGia: danhGia || null,
      js: ["/js/khachhang/chitietdondatphong"],
      css: ["/css/chitietdondatphong.css"],
    });
  } catch (err) {
    console.error("❌ Lỗi chi tiết đơn:", err);
    res.status(500).send("Lỗi server");
  }
};


// =====================================================
// 🗑️ HỦY ĐƠN ĐẶT PHÒNG (cách truyền thống, dùng form POST)
exports.huyDonDatPhong = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/khachhang/dangnhap");
    }

    const maDon = req.params.id;
    const { LyDoHuy } = req.body;

    if (!maDon) return res.status(400).send("Thiếu mã đơn");

    //Lấy mã khách hàng thật từ DB bằng MaTaiKhoan
    const maTaiKhoan = req.session.user.MaTaiKhoan;
    const kh = await KhachHang.findByMaTK(maTaiKhoan);

    if (!kh) return res.status(403).send("Không xác định được khách hàng");

    const maKhachHang = kh.MaKhachHang;

    //Kiểm tra đơn có thuộc về khách hàng không
    const [rows] = await db.execute(
      "SELECT MaKhachHang FROM DonDatPhong WHERE MaDon = ?",
      [maDon]
    );

    if (rows.length === 0) {
      return res.status(404).send("Không tìm thấy đơn đặt phòng");
    }

    if (rows[0].MaKhachHang !== maKhachHang) {
      return res.status(403).send("Bạn không có quyền hủy đơn này.");
    }

    // ⭐ Hủy đơn + lưu lý do
    await db.execute(
      `UPDATE DonDatPhong 
       SET TrangThai = 3, LiDoHuy = ? 
       WHERE MaDon = ?`,
      [LyDoHuy || null, maDon]
    );

    console.log(`🗑 Đơn #${maDon} của KH #${maKhachHang} đã bị hủy. Lý do: ${LyDoHuy}`);
    req.flash("success", "Hủy đơn thành công!");

    return res.redirect("/khachhang/don-dat-phong");

  } catch (err) {
    console.error("Lỗi khi hủy đơn:", err);
    return res.status(500).send("Lỗi khi hủy đơn đặt phòng.");
  }
};



// =====================================================
// 💳 THANH TOÁN (Render + Handle)
// =====================================================
exports.renderThanhToan = async (req, res) => {
  try {
    const don = await DonDatPhong.getThongTinThanhToan(req.params.id);
    if (!don) return res.status(404).send("Không tìm thấy đơn cần thanh toán.");
    res.render("khachhang/thanhtoan", { don });
  } catch (err) {
    console.error("Lỗi khi tải trang thanh toán:", err);
    res.status(500).send("Lỗi khi tải trang thanh toán.");
  }
};

exports.handleThanhToan = async (req, res) => {
  try {
    const { MaDon, SoTien } = req.body;
    await DonDatPhong.insertThanhToan(MaDon, SoTien);  // 💰 Ghi thanh toán
    await DonDatPhong.updateTrangThai(MaDon, 2);       // ✅ 2 = Hoàn tất
    console.log(`💰 Thanh toán đơn #${MaDon} thành công.`);
    res.redirect("/khachhang/don-dat-phong");
  } catch (err) {
    console.error("Lỗi xử lý thanh toán:", err);
    res.status(500).send("Lỗi khi xử lý thanh toán.");
  }
};

// =====================================================
// ⭐ ĐÁNH GIÁ PHÒNG (Render + Handle)
// =====================================================
exports.renderDanhGia = async (req, res) => {
  try {
    const maPhong = req.params.id;
    const user = req.session.user;
    if (!user) return res.redirect("/khachhang/dangnhap");

    // 🔍 Lấy mã khách hàng thật
    const [rows] = await db.execute(
      "SELECT MaKhachHang FROM khachhang WHERE MaTaiKhoan = ?",
      [user.MaTaiKhoan]
    );
    if (!rows.length) return res.redirect("/khachhang/dangnhap");

    const maKhachHang = rows[0].MaKhachHang;

    // 🧾 Kiểm tra KH có từng đặt phòng này chưa
    const [hasBooked] = await db.execute(
      `SELECT dp.MaDon 
       FROM DonDatPhong dp
       JOIN chitietdondatphong ctdp ON dp.MaDon = ctdp.MaDon
       WHERE dp.MaKhachHang = ? AND ctdp.MaPhong = ?
       LIMIT 1`,
      [maKhachHang, maPhong]
    );

    if (!hasBooked) {
      return res.render("khachhang/danhgia", {
        phong: null,
        danhGia: null,
        daDanhGia: false,
        editMode: false,
        error: "Bạn chưa từng đặt phòng này, không thể đánh giá.",
      });
    }

    // ✅ Lấy thông tin phòng để hiển thị
    const phongList = await DonDatPhong.getChiTietDonByPhong(maPhong);
    if (!phongList || phongList.length === 0) {
      return res.render("khachhang/danhgia", {
        phong: null,
        danhGia: null,
        daDanhGia: false,
        editMode: false,
        error: "Không tìm thấy thông tin phòng để đánh giá.",
      });
    }

    const phong = phongList[0];
    const danhGia = await DanhGia.getWithReply(maPhong, maKhachHang);

    res.render("khachhang/danhgia", {
      phong,
      danhGia,
      daDanhGia: !!danhGia,
      editMode: req.query.edit === "true",
      error: null,
    });

  } catch (err) {
    console.error("Lỗi hiển thị form đánh giá:", err);
    res.status(500).send("Lỗi khi tải trang đánh giá.");
  }
};
// =====================================================
// 🏨 QUẢN LÝ ĐƠN ĐẶT PHÒNG CHO NHÀ CUNG CẤP (BỔ SUNG)
// =====================================================
// ✅ KHAI BÁO HÀM getStatusText Ở ĐÂY
const getStatusText = (status) => {
  switch (Number(status)) {
      case 0: return 'Đã Đặt';
      case 1: return 'Đang Sử Dụng'; 
      case 2: return 'Đã Hoàn Tất'; 
      case 3: return 'Đã Hủy'; 
      default: return 'Không xác định';
  }
}
// 1. Render Danh sách Đơn đặt phòng cho NCC
exports.renderDanhSachDonDatPhongNCC = async (req, res) => {
  // BƯỚC 1: KIỂM TRA BẢO MẬT (Đăng nhập & Vai trò NCC)
  if (!req.session.user || req.session.user.PhanQuyen !== 'NhaCungCap') {
      return res.redirect("/nhacungcap/dangnhap");
  }
  
  // Lấy MaNCC trực tiếp từ session
  const maNCC = req.session.user.MaNCC; 
  
  // Kiểm tra tính hợp lệ nghiêm ngặt: MaNCC phải tồn tại
  if (!maNCC) { 
      console.error("Lỗi: Tài khoản NCC không có MaNCC hợp lệ trong session.");
      req.flash('error', 'Tài khoản của bạn chưa liên kết Mã Nhà Cung Cấp hoặc đang chờ duyệt.');
      // Chuyển hướng về trang chủ NCC (Dashboard)
      return res.redirect("/nhacungcap/"); 
  }

  // ⭐ BƯỚC 2: LẤY CÁC THAM SỐ LỌC VÀ TÌM KIẾM
  // Sử dụng trim() để đảm bảo chuỗi rỗng chỉ là chuỗi rỗng
  const trangThai = req.query.trangThai ? req.query.trangThai.trim() : ''; 
  const searchMaDon = req.query.searchMaDon ? req.query.searchMaDon.trim() : ''; 

  try {
      // ✅ Gọi Model với các tham số đã được làm sạch
      const orders = await DonDatPhong.getAllByNCC(maNCC, trangThai, searchMaDon);
      
      // ⭐ BƯỚC 3: FORMAT NGÀY THÁNG VÀ GÁN TEXT TRẠNG THÁI
      const formattedOrders = orders.map(d => ({
          ...d,
          NgayDat: d.NgayDat ? new Date(d.NgayDat).toLocaleDateString('vi-VN') : '',
          NgayNhan: d.NgayNhan ? new Date(d.NgayNhan).toLocaleDateString('vi-VN') : '',
          NgayTra: d.NgayTra ? new Date(d.NgayTra).toLocaleDateString('vi-VN') : '',
          TrangThaiText: getStatusText(d.TrangThai)
      }));
      res.render('nhacungcap/dondatphong/qldondat', {
          title: 'Quản lý Đơn Đặt Phòng',
          orders: formattedOrders,
          currentStatus: trangThai,
          searchMaDon: searchMaDon, 
          getStatusText
      });
  } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách đơn đặt phòng NCC:", error);
      // Có thể thêm thông báo lỗi cụ thể hơn trong môi trường phát triển
      res.status(500).send('Lỗi Server khi truy vấn danh sách đơn. Vui lòng kiểm tra lại Model getAllByNCC.');
  }
};
// 2. Render Chi tiết Đơn đặt phòng cho NCC
// controllers/donDatPhongController.js (Trong renderChiTietDonDatPhongNCC)

exports.renderChiTietDonDatPhongNCC = async (req, res) => {
  // ... (logic kiểm tra bảo mật)
  const maNCC = req.session.user.MaNCC;
  const maDon = req.params.id;

  try {
      // Model trả về object { donDat, chiTietPhong }
      const result = await DonDatPhong.getChiTietDonVaPhongChoNCC(maDon, maNCC);

      if (!result) { /* ... */ }
      
      // ⭐ SỬA: Lấy thông tin đơn chính từ result.donDat
      const orderDetail = result.donDat; 
      
      // ... (Logic format ngày tháng cho orderDetail)
      orderDetail.NgayDat = new Date(orderDetail.NgayDat).toLocaleDateString('vi-VN');
      orderDetail.NgayNhan = new Date(orderDetail.NgayNhan).toLocaleDateString('vi-VN');
      orderDetail.NgayTra = new Date(orderDetail.NgayTra).toLocaleDateString('vi-VN');
      orderDetail.TrangThaiText = getStatusText(orderDetail.TrangThai);
      
      res.render('nhacungcap/dondatphong/chitietdondatphong', {
          title: `Chi tiết Đơn hàng #${maDon}`,
          data: orderDetail, // Thông tin đơn chính
          chiTietPhong: result.chiTietPhong, // Thông tin các phòng (Mảng)
          getStatusText
      });

  } catch (error) { /* ... */ }
};

// 3. Xử lý Cập nhật Trạng thái Đơn của NCC
exports.handleCapNhatTrangThaiDonDatPhongNCC = async (req, res) => {
  // 🚨 Kiểm tra đăng nhập và vai trò
  if (!req.session.user || req.session.user.PhanQuyen !== 'NhaCungCap') {
    return res.redirect("/nhacungcap/dangnhap");
  }
  
  const maDon = req.params.id;
  const { newStatus } = req.body; 
  const maNCC = req.session.user.MaNCC;

  if (newStatus === undefined || isNaN(parseInt(newStatus))) {
      req.flash('error', 'Trạng thái cập nhật không hợp lệ.');
      return res.redirect('/nhacungcap/don-dat-phong/chitiet/' + maDon);
  }
  
  try {
      // ⭐ BƯỚC BẢO MẬT: Kiểm tra quyền sở hữu trước khi cập nhật
      const checkOwner = await DonDatPhong.getChiTietDonVaPhongChoNCC(maDon, maNCC);
      if (!checkOwner) {
          req.flash('error', 'Đơn đặt phòng không tồn tại hoặc bạn không có quyền cập nhật.');
          return res.redirect('/nhacungcap/don-dat-phong');
      }
      
      // ⭐ Thực hiện cập nhật trạng thái
      const success = await DonDatPhong.updateTrangThai(maDon, parseInt(newStatus));

      if (success) {
          req.flash('success', `Cập nhật trạng thái đơn #${maDon} thành công: ${getStatusText(newStatus)}.`);
      } else {
          req.flash('error', `Không thể cập nhật trạng thái cho đơn #${maDon}.`);
      }
      
      res.redirect('/nhacungcap/don-dat-phong/chitiet/' + maDon); 

  } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái đơn đặt phòng NCC:", error);
      req.flash('error', 'Lỗi server khi cập nhật trạng thái.');
      res.redirect('/nhacungcap/don-dat-phong/chitiet/' + maDon);
  }
};

