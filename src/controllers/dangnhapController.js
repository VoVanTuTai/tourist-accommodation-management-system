const bcrypt = require('bcryptjs');
const TaiKhoan = require('../models/taikhoan');

// ===============================
// 🔹 Hàm kiểm tra định dạng email
// ===============================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===============================
// 🔹 Hiển thị trang đăng nhập
// ===============================
exports.getLoginPage = (req, res) => {
  res.render('khachhang/dangnhap', {
    error: req.query.error || null,
    success: req.query.success === 'true',
    old: {},
    user: req.session.user || null
  });
};

// ===============================
// 🔹 Xử lý đăng nhập
// ===============================
exports.login = async (req, res) => {
  try {
    let { Email, MatKhau, rememberMe } = req.body;
    const old = { Email };

    Email = Email ? Email.trim() : '';
    MatKhau = MatKhau ? MatKhau.trim() : '';

    if (!Email && !MatKhau)
      return res.render('khachhang/dangnhap', { error: 'Email và mật khẩu bắt buộc!', old, success: null });
    if (!Email)
      return res.render('khachhang/dangnhap', { error: 'Email là bắt buộc!', old, success: null });
    if (!MatKhau)
      return res.render('khachhang/dangnhap', { error: 'Mật khẩu là bắt buộc!', old, success: null });

    if (!isValidEmail(Email))
      return res.render('khachhang/dangnhap', { error: 'Email không hợp lệ!', old, success: null });

    const account = await TaiKhoan.findByTaiKhoan(Email);
    if (!account)
      return res.render('khachhang/dangnhap', { error: 'Email hoặc mật khẩu không đúng!', old, success: null });

    if (account.TrangThai === 'Khoa')
      return res.render('khachhang/dangnhap', { error: 'Tài khoản đã bị khóa hoặc tạm ngưng!', old, success: null });

    const match = await bcrypt.compare(MatKhau, account.MatKhau);
    if (!match)
      return res.render('khachhang/dangnhap', { error: 'Email hoặc mật khẩu không đúng!', old, success: null });

    if (rememberMe) {
      req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.expires = false;
    }

    // ✅ Lưu session người dùng
    req.session.user = {
      MaTaiKhoan: account.MaTaiKhoan,
      TaiKhoan: account.TaiKhoan,
      PhanQuyen: account.PhanQuyen,
      TrangThai: account.TrangThai
    };

    // ✅ Kiểm tra nếu có URL trước đó (ví dụ: người dùng bị redirect do chưa đăng nhập)
    const redirectUrl = req.session.redirectAfterLogin || null;
    delete req.session.redirectAfterLogin;

    // ✅ Điều hướng thông minh theo quyền
    if (redirectUrl) {
      return res.redirect(redirectUrl);
    }

    if (req.session.user.PhanQuyen === 'Admin') {
      return res.redirect('/admin/dashboard');
    } else if (req.session.user.PhanQuyen === 'NhaCungCap') {
      return res.redirect('/nhacungcap/dashboard');
    } else {
      return res.redirect('/');
    }

  } catch (err) {
    console.error('🔥 Lỗi đăng nhập:', err);
    res.render('khachhang/dangnhap', {
      error: 'Lỗi hệ thống, vui lòng thử lại!',
      old: req.body,
      success: null
    });
  }
};

// ===============================
// 🔹 Đăng xuất
// ===============================
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};
