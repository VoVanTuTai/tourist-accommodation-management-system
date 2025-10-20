const bcrypt = require('bcryptjs');
const KhachHang = require('../models/khachhang');
const TaiKhoan = require('../models/taikhoan');

/** ------------------ VALIDATION UTILS ------------------ **/
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^0\d{9}$/.test(phone);
}

function isValidPassword(password) {
  // ≥8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt, không khoảng trắng
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/.test(password);
}

/** ------------------ HIỂN THỊ TRANG ĐĂNG KÝ ------------------ **/
exports.getRegisterPage = (req, res) => {
  res.render('khachhang/dangky', { error: null, old: {} });
};

/** ------------------ XỬ LÝ ĐĂNG KÝ ------------------ **/
exports.register = async (req, res) => {
  try {
    const { HoTen, Email, SoDienThoai, MatKhau, NhapLaiMatKhau, NgaySinh, GioiTinh } = req.body;
    const old = { HoTen, Email, SoDienThoai, NgaySinh, GioiTinh };

    // 1️⃣ Kiểm tra nhập thiếu
    if (!HoTen || !Email || !SoDienThoai || !MatKhau || !NhapLaiMatKhau || !NgaySinh || !GioiTinh)
      return res.render('khachhang/dangky', { error: 'Vui lòng nhập đầy đủ thông tin!', old });

    // 2️⃣ Kiểm tra định dạng
    if (!isValidEmail(Email))
      return res.render('khachhang/dangky', { error: 'Email không đúng định dạng!', old });

    if (!isValidPhone(SoDienThoai))
      return res.render('khachhang/dangky', { error: 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)!', old });

    if (!isValidPassword(MatKhau))
      return res.render('khachhang/dangky', {
        error: 'Mật khẩu phải ≥8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt!',
        old
      });

    if (MatKhau !== NhapLaiMatKhau)
      return res.render('khachhang/dangky', { error: 'Mật khẩu và nhập lại mật khẩu không khớp!', old });

    const birth = new Date(NgaySinh);
    if (birth > new Date())
      return res.render('khachhang/dangky', { error: 'Ngày sinh không hợp lệ (không thể ở tương lai)!', old });

    // 3️⃣ Kiểm tra email trùng ở 2 bảng
    const existingKH = await KhachHang.findByEmail(Email);
    const existingTK = await TaiKhoan.findByTaiKhoan(Email);

    if (existingKH !== null || existingTK !== null)
      return res.render('khachhang/dangky', { error: 'Email đã được sử dụng!', old });

    // 4️⃣ Tạo khách hàng
    const maKH = await KhachHang.create({ HoTen, Email, SoDienThoai, NgaySinh, GioiTinh });

    // 5️⃣ Băm mật khẩu
    const hashedPassword = await bcrypt.hash(MatKhau, 10);

    // 6️⃣ Tạo tài khoản
    await TaiKhoan.create({
      TaiKhoan: Email,
      MatKhau: hashedPassword,
      PhanQuyen: 'KhachHang',
      MaKhachHang: maKH,
      MaAdmin: null
    });
      res.send(`
  <html>
    <body style="font-family: sans-serif; text-align:center; margin-top:100px;">
      <h2 style="color: green;">Đăng ký thành công!</h2>
      <p>Đang chuyển hướng đến trang đăng nhập...</p>
      <script>
        setTimeout(() => {
          window.location.href = '/khachhang/dangnhap';
        }, 1000);
      </script>
    </body>
  </html>
`);


        // ✅ 7️⃣ Sau khi đăng ký thành công → chuyển tới trang đăng nhập
  } catch (err) {
    console.error('🔥 Lỗi đăng ký:', err);
    res.render('khachhang/dangky', {
      error: 'Lỗi hệ thống, vui lòng thử lại!',
      old: req.body
    });
  }
};

/** ------------------ TRANG QUẢN LÝ TÀI KHOẢN ------------------ **/
exports.getAccountPage = (req, res) => {
  if (!req.session.user) return res.redirect('/dangnhap');
  res.render('khachhang/quanlytaikhoan', { user: req.session.user });
};
