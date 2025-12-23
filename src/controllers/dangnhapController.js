const bcrypt = require('bcryptjs');
const TaiKhoan = require('../models/taikhoan');
const NhaCungCap = require('../models/NhaCungCap');

//
const dbPromise = require('../../config/db'); 

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

    if (account.TrangThai === 'Khoa' || account.TrangThai === 'ChoDuyet')
      return res.render('khachhang/dangnhap', { error: 'Tài khoản đã bị khóa hoặc đang chờ duyệt!', old, success: null });

    const match = await bcrypt.compare(MatKhau, account.MatKhau);
    if (!match)
      return res.render('khachhang/dangnhap', { error: 'Email hoặc mật khẩu không đúng!', old, success: null });

    if (rememberMe) {
      req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000;
    } else {
      req.session.cookie.expires = false;
    }

    // ✅ BỔ SUNG: Lấy thông tin HoTen từ bảng khachhang
    const db = await dbPromise; // Chờ kết nối database như nhóm bạn đang làm
    const [khachRows] = await db.execute('SELECT HoTen, SoDienThoai FROM khachhang WHERE MaTaiKhoan = ?', [account.MaTaiKhoan]);
    const thongTinKhach = khachRows.length > 0 ? khachRows[0] : {};

    // ✅ Lưu session người dùng
    req.session.user = {
      MaTaiKhoan: account.MaTaiKhoan,
      TaiKhoan: account.TaiKhoan,
      PhanQuyen: account.PhanQuyen,
      TrangThai: account.TrangThai,
      HoTen: thongTinKhach.HoTen || '', 
      SoDienThoai: thongTinKhach.SoDienThoai || ''
    };

    const redirectUrl = req.session.redirectAfterLogin || null;
    delete req.session.redirectAfterLogin;

    if (redirectUrl) {
      return res.redirect(redirectUrl);
    }

    if (req.session.user.PhanQuyen === 'Admin') {
      return res.redirect('/admin/dashboard');
    } else if (req.session.user.PhanQuyen === 'NhaCungCap') {
      const ncc = await NhaCungCap.getByTaiKhoan(account.MaTaiKhoan);
      if (!ncc) {
        return res.redirect('/nhacungcap/dangky');
      }
      req.session.user.MaNCC = ncc.MaNCC;
      req.session.user.TenNCC = ncc.TenNCC;
      return res.redirect('/nhacungcap/');
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