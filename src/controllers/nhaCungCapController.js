const NhaCungCap = require("../models/NhaCungCap") // Model phòng
const bcrypt = require('bcryptjs');
const TaiKhoan = require('../models/taikhoan');

const { isValidFullname, isValidEmail, isValidVietnamPhone, isValidPassword } = require("../../ultils/form")
const fs = require("fs")
const path = require("path")
const jsLibraries = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
    "https://cdn-script.com/ajax/libs/jquery/3.7.1/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js",
    "/js/nhacungcap/dangky.js",
]

exports.renderDangKyNhaCungCap = (req, res) => {
    res.render("nhacungcap/dangky", {
        title: "Đăng ký nhà cung cấp",
        css: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css", // Gán CSS riêng cho view đăng ký nhà cung cấp
        js: jsLibraries, // Gán JS riêng cho view đăng ký nhà cung cấp,
        errors: {},
        formData: {},
    })
}

exports.registerNhaCungCap = async (req, res) => {
    const { TenNCC, Email, Phone, LoaiNganHang, ThongTinThanhToan, LoaiHinh, Password, ConfirmPassword } = req.body;
    const errors = {};

    if (!isValidFullname(TenNCC)) {
        errors.TenNCC = "Tên nhà cung cấp không hợp lệ. Ít nhất 5 ký tự, không toàn số, không ký tự đặc biệt.";
    }
    if (!isValidEmail(Email)) {
        errors.Email = "Email không hợp lệ. Phải có ký tự @ và kết thúc với .com";
    }
    if (!isValidVietnamPhone(Phone)) {
        errors.Phone = "Số điện thoại không hợp lệ. Phải là số điện thoại Việt Nam bắt đầu bằng 09, 03 hoặc 08 và có 10 chữ số.";
    }
    if (!isValidPassword(Password)) {
        errors.Password = "Mật khẩu không hợp lệ. Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
    }
    if (Password !== ConfirmPassword) {
        errors.ConfirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    if (!LoaiNganHang || LoaiNganHang.trim() === "") {
        errors.LoaiNganHang = "Vui lòng chọn loại ngân hàng.";
    }
    if (!LoaiHinh || LoaiHinh.trim() === "") {
        errors.LoaiHinh = "Vui lòng chọn loại hình nhà cung cấp.";
    }
    if (ThongTinThanhToan.length < 5 || ThongTinThanhToan.length > 15) {
        errors.ThongTinThanhToan = "Thông tin thanh toán không hợp lệ. Ít nhất 5 chữ số và tối đa 15.";
    }

    if (Object.keys(errors).length > 0) {
        // Nếu có lỗi, xóa file đã tải lên (nếu có)
        if (req.file) {
            fs.unlink(path.join(__dirname, "../public/images", req.file.filename), (err) => {
                if (err) console.error("Lỗi xóa file ảnh:", err);
            });
        }
        return res.status(400).render("nhacungcap/dangky", {
            title: "Đăng ký nhà cung cấp",
            css: "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
            js: jsLibraries,
            errors,
            formData: req.body,
        });
    }
    // Nếu có file upload, lấy tên file, còn không thì dùng giá trị rỗng
    const giayPhepKD = req.file ? req.file.filename : "";

    const data = {
        TenNCC: TenNCC,
        LoaiNganHang: LoaiNganHang,
        ThongTinThanhToan: ThongTinThanhToan,
        LoaiHinh: LoaiHinh,
        GiayPhepKD: giayPhepKD, // ✅ lưu tên file ảnh
    }
    // Tạo tài khoản cho nhà cung cấp
    const result = await NhaCungCap.addNhaCungCap(data);
    const maNCC = result.insertId; // Lấy MaNhaCungCap vừa tạo
    // Tạo tài khoản đăng nhập
    const hashedPassword = await bcrypt.hash(MatKhau, 10);
    await TaiKhoan.create({
      TaiKhoan: Email,
      MatKhau: hashedPassword,
      PhanQuyen: 'NhaCungCap',
      MaNhaCungCap: maNCC,
      MaAdmin: null
    });
}
// Xử lý đăng ký nhà cung cấp
exports.handleDangKyNhaCungCap = (req, res) => {
    // Nếu có file upload, lấy tên file, còn không thì dùng giá trị rỗng
    const giayPhepKD = req.file ? req.file.filename : ""

    const data = {
        TenNCC: req.body.TenNCC,
        Email: req.body.Email,
        Phone: req.body.Phone,
        ThongTinThanhToan: req.body.ThongTinThanhToan,
        LoaiHinh: req.body.LoaiHinh,
        GiayPhepKD: giayPhepKD, // ✅ lưu tên file ảnh
        Password: req.body.Password,
        ConfirmPassword: req.body.ConfirmPassword,
    }

    NhaCungCap.addNhaCungCap(data, err => {
        if (err) {
            console.error("Lỗi đăng ký nhà cung cấp:", err)
            return res.status(500).send("Lỗi đăng ký nhà cung cấp")
        }
        res.redirect("/nhaCungCap/dangky?success=1")
    })
}
