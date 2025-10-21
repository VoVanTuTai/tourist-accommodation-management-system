// src/controllers/khachhangController.js
const bcrypt = require('bcryptjs');
const KhachHang = require('../models/khachhang');
const TaiKhoan = require('../models/taikhoan');
module.exports.getTaiKhoanView = async function (req, res) {
  try {
    const maTK = req.session.MaTaiKhoan || (req.session.user && req.session.user.MaTaiKhoan);
    const profile = await KhachHang.findByMaTK(maTK);

    res.render('khachhang/thongtintaikhoan', {
      profile,
      message: null,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('khachhang/thongtintaikhoan', {
      profile: null,
      message: null,
      error: 'Không thể tải thông tin tài khoản.'
    });
  }
};

module.exports.postCapNhatTaiKhoan = async function (req, res) {
  try {
    const maTK = req.session.MaTaiKhoan || (req.session.user && req.session.user.MaTaiKhoan);

    const { hoTen, sdt, gioiTinh, matKhauMoi } = req.body;

    // cập nhật bảng KhachHang
    await KhachHang.updateByMaTK(maTK, {
      HoTen: hoTen.trim(),
      SoDienThoai: sdt.trim(),
      GioiTinh: gioiTinh.trim(),
    });

    // nếu có mật khẩu mới
    if (matKhauMoi && matKhauMoi.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(matKhauMoi.trim(), salt);
      await TaiKhoan.updatePasswordByMaTK(maTk, hash);
    }

    const profile = await KhachHang.findByMaTK(maTK);

    res.render('khachhang/thongtintaikhoan', {
      profile,
      message: 'Cập nhật thành công.',
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('khachhang/thongtintaikhoan', {
      profile: null,
      message: null,
      error: 'Có lỗi khi cập nhật thông tin.'
    });
  }
};
