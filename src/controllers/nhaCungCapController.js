const { NhaCungCap, addNhaCungCap } = require("../models/NhaCungCap") // Model phòng
const bcrypt = require("bcryptjs")
const TaiKhoan = require("../models/taikhoan")
const db = require("../../config/db");
const DiaChi = require("../models/DiaChi");

const {
    isValidFullname,
    isValidEmail,
    isValidVietnamPhone,
    isValidPassword,
} = require("../middlewares/validate")
const fs = require("fs")
const path = require("path")
const e = require("express")
const { error } = require("console")
const jsLibraries = [
    "https://cdn-script.com/ajax/libs/jquery/3.7.1/jquery.min.js",
    "/js/nhacungcap/dangky.js",
]

exports.renderDangKyNhaCungCap = async (req, res) => {
    // 🧭 Lấy danh sách tỉnh và xã (để hiển thị select)
    const [tinhs] = await db.execute("SELECT * FROM Tinh");

    res.render("nhacungcap/dangky", {
        title: "Đăng ký nhà cung cấp",
        js: jsLibraries, // Gán JS riêng cho view đăng ký nhà cung cấp,
        errors: {},
        formData: {},
        tinhs
    })
}

exports.registerNhaCungCap = async (req, res) => {
    const [tinhs] = await db.execute("SELECT * FROM Tinh");
    await db.query('START TRANSACTION;');

    try {
        const {
            TenNCC,
            Email,
            Phone,
            LoaiNganHang,
            ThongTinThanhToan,
            LoaiHinh,
            Password,
            ConfirmPassword,
            Tinh,
            Xa,
            DiaChiChiTiet
        } = req.body
        const errors = {}

        if (!isValidFullname(TenNCC)) {
            errors.TenNCC =
                "Tên nhà cung cấp không hợp lệ. Ít nhất 5 ký tự, không toàn số, không ký tự đặc biệt."
        }
        if (!isValidEmail(Email)) {
            errors.Email =
                "Email không hợp lệ. Phải có ký tự @ và kết thúc với .com"
        }
        if (!isValidVietnamPhone(Phone)) {
            errors.Phone =
                "Số điện thoại không hợp lệ. Phải là số điện thoại Việt Nam bắt đầu bằng 09, 03 hoặc 08 và có 10 chữ số."
        }
        if (!isValidPassword(Password)) {
            errors.Password =
                "Mật khẩu không hợp lệ. Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
        }
        if (!Tinh || Tinh.trim() === "") {
            errors.Tinh = "Vui lòng chọn tỉnh."
        }
        if (!Xa || Xa.trim() === "") {
            errors.Xa = "Vui lòng chọn xã."
        }
        if (!DiaChiChiTiet || DiaChiChiTiet.trim() === "") {
            errors.DiaChiChiTiet = "Vui lòng nhập địa chỉ chi tiết."
        }
        if (Password !== ConfirmPassword) {
            errors.ConfirmPassword = "Mật khẩu xác nhận không khớp."
        }
        if (!LoaiNganHang || LoaiNganHang.trim() === "") {
            errors.LoaiNganHang = "Vui lòng chọn loại ngân hàng."
        }
        if (!LoaiHinh || LoaiHinh.trim() === "") {
            errors.LoaiHinh = "Vui lòng chọn loại hình nhà cung cấp."
        }
        if (ThongTinThanhToan.length < 5 || ThongTinThanhToan.length > 15) {
            errors.ThongTinThanhToan =
                "Thông tin thanh toán không hợp lệ. Ít nhất 5 chữ số và tối đa 15."
        }
        // Nếu có file upload, lấy tên file, còn không thì dùng giá trị rỗng
        const giayPhepKD = req.file ? req.file.originalname : ""

        if (!giayPhepKD) {
            errors.giayPhepKD = "Vui lòng tải giấy phép kinh doanh."
        }

        if (Object.keys(errors).length > 0) {
            // // Nếu có lỗi, xóa file đã tải lên (nếu có)
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) console.error("Lỗi xóa file ảnh:", err)
                })
            }
            return res.status(400).render("nhacungcap/dangky", {
                title: "Đăng ký nhà cung cấp",
                js: jsLibraries,
                errors,
                formData: req.body,
                tinhs
            })
        }

        const data = {
            TenNCC: TenNCC,
            LoaiNganHang: LoaiNganHang,
            ThongTinThanhToan: ThongTinThanhToan,
            LoaiHinh: LoaiHinh,
            GiayPhepKD: giayPhepKD, // ✅ lưu tên file ảnh,
        }
        // Kiểm tra tồn tại tài khoản đăng ký nhà cung cấp
        const isEmailRegistered = await TaiKhoan.findByTaiKhoan(Email)
        if (isEmailRegistered) {
            errors.Email = "Email đã đăng ký."
            // // Nếu có lỗi, xóa file đã tải lên (nếu có)
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) console.error("Lỗi xóa file ảnh:", err)
                })
            }
            return res.status(400).render("nhacungcap/dangky", {
                title: "Đăng ký nhà cung cấp",
                js: jsLibraries,
                errors,
                formData: req.body,
                tinhs
            })
        }
        // Tạo tài khoản đăng nhập ở trạng thái Chờ Duyệt
        const hashedPassword = await bcrypt.hash(Password, 10)
        const maTaiKhoan = await TaiKhoan.create({
            TaiKhoan: Email,
            MatKhau: hashedPassword,
            PhanQuyen: "NhaCungCap",
            TrangThai: "ChoDuyet",
        })
        // Tạo địa chỉ cho nhà cung cấp
        const maDiaChi = await DiaChi.addDiaChi(DiaChiChiTiet, Xa)
        data.MaDiaChi = maDiaChi
        data.MaTaiKhoan = maTaiKhoan
        // Tạo tài khoản cho nhà cung cấp
        const result = await addNhaCungCap(data)

        await db.query("COMMIT;");
        res.send(`
        <html>
            <body style="font-family: sans-serif; text-align:center; margin-top:100px;">
            <h2 style="color: green;">Đăng ký thành công!</h2>
            <p>Chờ xác nhận tài khoản...</p>
            <p><a href="/">Trở về trang chủ</a></p>
            </body>
        </html>
    `)
    } catch (error) {
        console.error("Xảy ra lỗi trong khi đăng ký nhà cung cấp:", error)
        await db.query("ROLLBACK;");
        res.status(500).render("nhacungcap/dangky", {
            title: "Đăng ký nhà cung cấp",
            js: jsLibraries,
            errors: {},
            formData: req.body,
            tinhs
        })
    }
}
// Xử lý đăng nhập
exports.renderDangNhapNhaCungCap = (req, res) => {
    res.render("nhacungcap/dangnhap", {
        title: "Đăng nhập nhà cung cấp",
        js: jsLibraries,
        errors: null,
        formData: req.body,
    })
}

exports.loginNhaCungCap = async (req, res) => {
    try {
      const { Email, Password, Remember } = req.body;
      const errors = {};
  
      // 1️⃣ Kiểm tra dữ liệu nhập
      if (!Email || Email.trim() === "") {
        errors.Email = "Vui lòng nhập email.";
      } else if (!isValidEmail(Email)) {
        errors.Email = "Email không hợp lệ. Phải có ký tự @ và kết thúc với .com";
      }
      if (!Password || Password.trim() === "") {
        errors.Password = "Vui lòng nhập mật khẩu.";
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).render("nhacungcap/dangnhap", {
          title: "Đăng nhập nhà cung cấp",
          js: jsLibraries,
          errors,
          formData: req.body,
        });
      }
  
      // 2️⃣ Truy vấn tài khoản và thông tin nhà cung cấp (JOIN)
      const [rows] = await db.execute(
        `SELECT 
            tk.MaTaiKhoan, tk.TaiKhoan, tk.MatKhau, tk.PhanQuyen, tk.TrangThai,
            ncc.MaNCC, ncc.TenNCC
         FROM TaiKhoan tk
         JOIN NhaCungCap ncc ON tk.MaTaiKhoan = ncc.MaTaiKhoan
         WHERE tk.TaiKhoan = ?`,
        [Email]
      );
  
      const account = rows[0];
      if (!account) {
        errors.Email = "Tài khoản Email không tồn tại";
        return res.status(400).render("nhacungcap/dangnhap", {
          title: "Đăng nhập nhà cung cấp",
          js: jsLibraries,
          errors,
          formData: req.body,
        });
      }
  
      // 3️⃣ Kiểm tra mật khẩu
      const passwordMatch = await bcrypt.compare(Password, account.MatKhau);
      if (!passwordMatch) {
        errors.Password = "Mật khẩu không đúng";
        return res.status(400).render("nhacungcap/dangnhap", {
          title: "Đăng nhập nhà cung cấp",
          js: jsLibraries,
          errors,
          formData: req.body,
        });
      }
  
      // 4️⃣ Kiểm tra trạng thái tài khoản
      if (account.TrangThai === "Khoa") {
        errors.Global = "Tài khoản của bạn đã bị khóa";
      } else if (account.TrangThai === "ChoDuyet") {
        errors.Global = "Tài khoản của bạn đang chờ duyệt";
      }
      if (Object.keys(errors).length > 0) {
        return res.status(400).render("nhacungcap/dangnhap", {
          title: "Đăng nhập nhà cung cấp",
          js: jsLibraries,
          errors,
          formData: req.body,
        });
      }
  
      // 5️⃣ Xử lý “Ghi nhớ đăng nhập”
      if (Remember) {
        req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000; // 2 ngày
      } else {
        req.session.cookie.expires = false; // Hết khi tắt trình duyệt
      }
  
      // 6️⃣ Tạo session đăng nhập (đã có MaNCC thực)
      req.session.user = {
        MaTaiKhoan: account.MaTaiKhoan,
        TaiKhoan: account.TaiKhoan,
        PhanQuyen: account.PhanQuyen,
        TrangThai: account.TrangThai,
        MaNCC: account.MaNCC, // ✅ Lấy từ bảng nhacungcap
        TenNCC: account.TenNCC, // ✅ Tên NCC để hiển thị
      };
  
      console.log("✅ NCC đăng nhập:", req.session.user);
  
      // 7️⃣ Chuyển hướng đến danh sách phòng
      res.redirect("/nhacungcap/phong");
    } catch (err) {
      console.error("❌ Lỗi trong loginNhaCungCap:", err);
      res.status(500).render("nhacungcap/dangnhap", {
        title: "Đăng nhập nhà cung cấp",
        js: jsLibraries,
        errors: { Global: "Lỗi hệ thống, vui lòng thử lại sau." },
        formData: req.body,
      });
    }
  };


// ===============================
// 🔹 Đăng xuất
// ===============================
exports.logoutNhaCungCap = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};
