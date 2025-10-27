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
    error: req.query.error || null, // ✅ nhận lỗi từ middleware nếu chưa đăng nhập
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

    // Trim để tránh space đầu/cuối
    Email = Email ? Email.trim() : '';
    MatKhau = MatKhau ? MatKhau.trim() : '';

    // 1️⃣ Kiểm tra nhập đủ trường
    if (!Email && !MatKhau)
      return res.render('khachhang/dangnhap', { error: 'Email và mật khẩu bắt buộc!', old, success: null });
    if (!Email)
      return res.render('khachhang/dangnhap', { error: 'Email là bắt buộc!', old, success: null });
    if (!MatKhau)
      return res.render('khachhang/dangnhap', { error: 'Mật khẩu là bắt buộc!', old, success: null });

    // 2️⃣ Kiểm tra định dạng email
    if (!isValidEmail(Email))
      return res.render('khachhang/dangnhap', { error: 'Email không hợp lệ!', old, success: null });

    // 3️⃣ Lấy thông tin tài khoản từ DB
    const account = await TaiKhoan.findByTaiKhoan(Email);
    if (!account)
      return res.render('khachhang/dangnhap', { error: 'Email hoặc mật khẩu không đúng!', old, success: null });

    // 4️⃣ Kiểm tra trạng thái tài khoản
    if (account.TrangThai === 'Khoa')
      return res.render('khachhang/dangnhap', { error: 'Tài khoản đã bị khóa hoặc tạm ngưng!', old, success: null });

    // 5️⃣ So sánh mật khẩu (đã băm)
    const match = await bcrypt.compare(MatKhau, account.MatKhau);
    if (!match)
      return res.render('khachhang/dangnhap', { error: 'Email hoặc mật khẩu không đúng!', old, success: null });

    // 6️⃣ Xử lý “Ghi nhớ đăng nhập”
    if (rememberMe) {
      req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000; // 2 ngày
    } else {
      req.session.cookie.expires = false; // hết khi tắt trình duyệt
    }

    // 7️⃣ Tạo session đăng nhập (chỉ giữ thông tin cần thiết)
    req.session.user = {
      MaTaiKhoan: account.MaTaiKhoan,
      TaiKhoan: account.TaiKhoan,
      PhanQuyen: account.PhanQuyen,
      TrangThai: account.TrangThai
    };

    // ✅ 8️⃣ Sau khi đăng nhập thành công:
    // Nếu trước đó có lưu URL cần quay lại (vd: /khachhang/dat-phong/5) → quay về đó
    // Ngược lại, về trang chủ
    const redirectUrl = req.session.redirectAfterLogin || '/';
    delete req.session.redirectAfterLogin;

    res.redirect(redirectUrl);
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
