const DanhGia = require("../models/DanhGia");
const DonDatPhong = require("../models/DonDatPhong");
const KhachHang = require("../models/khachhang");

// [GET] /khachhang/don-dat-phong/:maDon/danhgia
// [GET] /khachhang/don-dat-phong/:maDon/danhgia
exports.renderDanhGia = async (req, res) => {
  try {
    const maDon = req.params.maDon;

    const don = await DonDatPhong.getDonVaPhong(maDon);
    if (!don) {
      return res.render("khachhang/danhgia", {
        error: "Không tìm thấy đơn đặt phòng",
        don: null,
        danhGia: null,
        danhSachPhong: [],
        selectedMaPhong: null,
        daDanhGia: false,
        editMode: false,
        phanHoi: null
      });
    }

    const maKhachHang = don.MaKhachHang;
    const danhSachPhong = await DonDatPhong.getDanhSachPhongTheoDon(maDon);

    let selectedMaPhong = req.query.maPhong
      ? Number(req.query.maPhong)
      : (danhSachPhong[0]?.MaPhong || null);

    let danhGia = await DanhGia.getByUserAndPhong(maKhachHang, selectedMaPhong);

    if (danhGia?.HinhAnh) {
      try { danhGia.HinhAnh = JSON.parse(danhGia.HinhAnh); }
      catch { danhGia.HinhAnh = []; }
    }
    // ⭐ Lấy phản hồi
    let phanHoi = null;

    if (danhGia?.MaDanhGia) {
      phanHoi = await DanhGia.getPhanHoiByMaDanhGia(danhGia.MaDanhGia);
    }

    return res.render("khachhang/danhgia", {
      error: null,
      don,
      danhGia,
      danhSachPhong,
      selectedMaPhong,
      daDanhGia: !!danhGia,
      editMode: req.query.edit === "true",
      phanHoi
    });

  } catch (err) {
    console.error("❌ renderDanhGia:", err);
    res.status(500).send("Lỗi khi hiển thị trang đánh giá");
  }
};


// [POST] /khachhang/don-dat-phong/:maDon/danhgia
exports.handleDanhGia = async (req, res) => {
  try {
    const maDon = req.params.maDon;

    // Kiểm tra đăng nhập
    if (!req.session.user) {
      return res.status(401).send("Vui lòng đăng nhập lại.");
    }

    const maTaiKhoan = req.session.user.MaTaiKhoan;
    const khachHang = await KhachHang.findByMaTK(maTaiKhoan);
    const maKhachHang = khachHang?.MaKhachHang;

    // Lấy dữ liệu form
    const { SoSao, NoiDung, MaPhong } = req.body;

    if (!maKhachHang || !MaPhong) {
      console.error("❌ Thiếu tham số:", { maKhachHang, MaPhong });
      return res.status(400).send("Thiếu thông tin khách hàng hoặc phòng.");
    }

    // ====== Xử lý FILE ẢNH (NHIỀU ẢNH) ======
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map(file => file.filename); // Danh sách ảnh mới
    }

    // ====== Kiểm tra nếu khách hàng đã từng đánh giá phòng này ======
    const existed = await DanhGia.getByUserAndPhong(maKhachHang, Number(MaPhong));

    // Nếu đã có đánh giá → giữ lại ảnh cũ (nếu không upload mới)
    let finalImages = [];

    if (existed) {
      if (uploadedImages.length > 0) {
        // Có upload ảnh mới → ghi đè
        finalImages = uploadedImages;
      } else {
        // Không upload → giữ ảnh cũ
        try {
          finalImages = existed.HinhAnh ? JSON.parse(existed.HinhAnh) : [];
        } catch {
          finalImages = [];
        }
      }

      // ====== CẬP NHẬT ======
      await DanhGia.update({
        MaKhachHang: maKhachHang,
        MaPhong: Number(MaPhong),
        SoSao,
        NoiDung,
        HinhAnh: JSON.stringify(finalImages),
      });

    } else {
      // ====== THÊM MỚI ======
      finalImages = uploadedImages; // chỉ có ảnh mới

      await DanhGia.insert({
        MaKhachHang: maKhachHang,
        MaPhong: Number(MaPhong),
        SoSao,
        NoiDung,
        HinhAnh: JSON.stringify(finalImages),
      });
    }

    // Chuyển hướng lại và giữ MaPhong
    res.redirect(`/khachhang/don-dat-phong/${maDon}/danhgia?maPhong=${MaPhong}`);

  } catch (err) {
    console.error("❌ handleDanhGia:", err);
    res.status(500).send("Lỗi khi gửi đánh giá.");
  }
};
