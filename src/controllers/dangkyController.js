const bcrypt = require("bcryptjs")
const KhachHang = require("../models/khachhang")
const TaiKhoan = require("../models/taikhoan")

/** ------------------ VALIDATION UTILS ------------------ **/
function isValidName(name) {
    // 1. Trim khoảng trắng thừa ở 2 đầu
    const cleanName = name.trim();
    
    // 2. Regex: Chỉ chữ cái và khoảng trắng đơn giữa các từ
    // Chặn trường hợp có 2 khoảng trắng liên tiếp
    const regex = /^[\p{L}]+(\s[\p{L}]+)*$/u;
    
    return regex.test(cleanName);
}

function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(email);
}


function isValidPhone(phone) {
    return /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/.test(phone);
}

function isValidPassword(password) {
    // ≥8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt, không khoảng trắng
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/.test(password)
}

/** ------------------ HIỂN THỊ TRANG ĐĂNG KÝ ------------------ **/
exports.getRegisterPage = (req, res) => {
    res.render("khachhang/dangky", { error: null, old: {} })
}

/** ------------------ XỬ LÝ ĐĂNG KÝ ------------------ **/
exports.register = async (req, res) => {
    try {
        const {
            HoTen,
            Email,
            SoDienThoai,
            MatKhau,
            NhapLaiMatKhau,
            NgaySinh,
            GioiTinh,
        } = req.body
        const old = { HoTen, Email, SoDienThoai, NgaySinh, GioiTinh }

        // 1️⃣ Kiểm tra nhập thiếu
        if (
            !HoTen ||
            !Email ||
            !SoDienThoai ||
            !MatKhau ||
            !NhapLaiMatKhau ||
            !NgaySinh ||
            !GioiTinh
        )
            return res.render("khachhang/dangky", {
                error: "Vui lòng nhập đầy đủ thông tin!",
                old,
            })

        // 2️⃣ Kiểm tra định dạng
        if (!isValidName(HoTen))
            return res.render("khachhang/dangky", {
                error: "Họ tên không hợp lệ!",
                old,
            })
        if (!isValidEmail(Email))
            return res.render("khachhang/dangky", {
                error: "Email không đúng định dạng!",
                old,
            })

        if (!isValidPhone(SoDienThoai))
            return res.render("khachhang/dangky", {
                error: "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)!",
                old,
            })

        if (!isValidPassword(MatKhau))
            return res.render("khachhang/dangky", {
                error: "Mật khẩu phải ≥8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt!",
                old,
            })

        if (MatKhau !== NhapLaiMatKhau)
            return res.render("khachhang/dangky", {
                error: "Mật khẩu và nhập lại mật khẩu không khớp!",
                old,
            })

        const birth = new Date(NgaySinh)
        if (birth > new Date())
            return res.render("khachhang/dangky", {
                error: "Ngày sinh không hợp lệ (không thể ở tương lai)!",
                old,
            })

        // 3️⃣ Kiểm tra email trùng ở 2 bảng
        const existingKH = await KhachHang.findByEmail(Email)
        const existingTK = await TaiKhoan.findByTaiKhoan(Email)

        if (existingKH || existingTK)
            return res.render("khachhang/dangky", {
                error: "Email đã được sử dụng!",
                old,
            })

        // 4️⃣ Băm mật khẩu
        const hashedPassword = await bcrypt.hash(MatKhau, 10)

        // 5️⃣ Tạo tài khoản (bảng TaiKhoan)
        const maTaiKhoan = await TaiKhoan.create({
            TaiKhoan: Email,
            MatKhau: hashedPassword,
            PhanQuyen: "KhachHang",
            MaKhachHang: null,
            MaAdmin: null,
        })

        // 6️⃣ Tạo khách hàng (bảng KhachHang, gắn MaTaiKhoan)
        await KhachHang.create({
            MaTaiKhoan: maTaiKhoan,
            HoTen,
            Email,
            SoDienThoai,
            NgaySinh,
            GioiTinh,
        })

        // 7️⃣ Giao diện thông báo
        res.send(`
      <html>
        <body style="font-family: sans-serif; text-align:center; margin-top:100px;">
          <h2 style="color: green;">🎉 Đăng ký thành công!</h2>
          <p>Đang chuyển hướng đến trang đăng nhập...</p>
          <script>
            setTimeout(() => {
              window.location.href = '/khachhang/dangnhap';
            }, 1000);
          </script>
        </body>
      </html>
    `)
    } catch (err) {
        console.error("🔥 Lỗi đăng ký:", err)
        res.render("khachhang/dangky", {
            error: "Lỗi hệ thống, vui lòng thử lại!",
            old: req.body,
        })
    }
}

/** ------------------ TRANG QUẢN LÝ TÀI KHOẢN ------------------ **/
exports.getAccountPage = (req, res) => {
    if (!req.session.user) return res.redirect("/khachhang/dangnhap")
    res.render("khachhang/quanlytaikhoan", { user: req.session.user })
}
