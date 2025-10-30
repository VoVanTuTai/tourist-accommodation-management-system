const DanhGia = require("../models/DanhGia");
const DonDatPhong = require("../models/DonDatPhong");
const KhachHang = require("../models/khachhang");

// [GET] /khachhang/don-dat-phong/:maDon/danhgia
exports.renderDanhGia = async (req, res) => {
  try {
    const maDon = req.params.maDon;

    // Lấy thông tin tổng quan đơn (gộp NCC, danh sách tên phòng, v.v.)
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
      });
    }

    const maKhachHang = don.MaKhachHang;

    // Lấy danh sách các phòng thuộc đơn để hiển thị dropdown
    const danhSachPhong = await DonDatPhong.getDanhSachPhongTheoDon(maDon);

    // Xác định phòng đang được chọn để xem/đánh giá
    let selectedMaPhong = req.query.maPhong
      ? Number(req.query.maPhong)
      : (danhSachPhong[0]?.MaPhong || null);

    if (!selectedMaPhong) {
      // Không có phòng nào trong đơn -> hiển thị form trống
      console.warn("⚠️ Không tìm thấy phòng trong đơn:", { maDon });
      return res.render("khachhang/danhgia", {
        error: null,
        don,
        danhGia: null,
        danhSachPhong,
        selectedMaPhong: null,
        daDanhGia: false,
        editMode: false,
      });
    }

    // Lấy đánh giá (nếu có) cho phòng đang chọn
    const danhGia = await DanhGia.getByUserAndPhong(maKhachHang, selectedMaPhong);

    return res.render("khachhang/danhgia", {
      error: null,
      don,
      danhGia,
      danhSachPhong,
      selectedMaPhong,
      daDanhGia: !!danhGia,
      editMode: req.query.edit === "true",
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

    if (!req.session.user) {
      return res.status(401).send("Vui lòng đăng nhập lại.");
    }

    // Lấy MaKhachHang từ MaTaiKhoan (JOIN TaiKhoan -> KhachHang)
    const maTaiKhoan = req.session.user.MaTaiKhoan;
    const khachHang = await KhachHang.findByMaTK(maTaiKhoan);
    const maKhachHang = khachHang?.MaKhachHang;

    const { SoSao, NoiDung, MaPhong } = req.body; // <<< LẤY MaPhong TỪ FORM
    const HinhAnh = req.file ? req.file.filename : null;

    if (!maKhachHang || !MaPhong) {
      console.error("❌ Thiếu tham số handleDanhGia:", { maKhachHang, MaPhong });
      return res.status(400).send("Thiếu thông tin khách hàng hoặc phòng.");
    }

    const existed = await DanhGia.getByUserAndPhong(maKhachHang, Number(MaPhong));

    if (existed) {
      await DanhGia.update({
        MaKhachHang: maKhachHang,
        MaPhong: Number(MaPhong),
        SoSao,
        NoiDung,
        HinhAnh,
      });
    } else {
      await DanhGia.insert({
        MaKhachHang: maKhachHang,
        MaPhong: Number(MaPhong),
        SoSao,
        NoiDung,
        HinhAnh,
      });
    }

    // Sau khi submit xong, quay lại trang và giữ phòng đang chọn bằng query ?maPhong=
    res.redirect(`/khachhang/don-dat-phong/${maDon}/danhgia?maPhong=${MaPhong}`);
  } catch (err) {
    console.error("❌ handleDanhGia:", err);
    res.status(500).send("Lỗi khi gửi đánh giá.");
  }
};
