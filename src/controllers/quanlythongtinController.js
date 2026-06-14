// src/controllers/khachhangController.js
const bcrypt = require("bcryptjs")
const KhachHang = require("../models/khachhang")
const TaiKhoan = require("../models/taikhoan")
module.exports.getTaiKhoanView = async function (req, res) {
    try {
        const maTK =
            req.session.MaTaiKhoan ||
            (req.session.user && req.session.user.MaTaiKhoan)
        const profile = await KhachHang.findByMaTK(maTK)

        res.render("khachhang/thongtintaikhoan", {
            profile,
            message: null,
            error: null,
        })
    } catch (err) {
        console.error(err)
        res.render("khachhang/thongtintaikhoan", {
            profile: null,
            message: null,
            error: "Không thể tải thông tin tài khoản.",
        })
    }
}
function isValidName(name) {
    // 1. Trim khoảng trắng thừa ở 2 đầu
    const cleanName = name.trim();
    
    // 2. Regex: Chỉ chữ cái và khoảng trắng đơn giữa các từ
    // Chặn trường hợp có 2 khoảng trắng liên tiếp
    const regex = /^[\p{L}]+(\s[\p{L}]+)*$/u;
    
    return regex.test(cleanName);
}
module.exports.postCapNhatTaiKhoan = async function (req, res) {
    try {
        const maTK =
            req.session.MaTaiKhoan ||
            (req.session.user && req.session.user.MaTaiKhoan)

        let { hoTen, sdt, gioiTinh, matKhauMoi } = req.body

        // ===== TRIM =====
        hoTen = hoTen ? hoTen.trim() : ""
        sdt = sdt ? sdt.trim() : ""
        gioiTinh = gioiTinh ? gioiTinh.trim() : ""

        // ===== VALIDATE HỌ TÊN =====
        
        if (hoTen === "") {
            return res.render("khachhang/thongtintaikhoan", {
                profile: await KhachHang.findByMaTK(maTK),
                message: null,
                error: "Họ tên không được để trống",
            })
        }

        if (!isValidName(hoTen)) {
            return res.render("khachhang/thongtintaikhoan", {
                profile: await KhachHang.findByMaTK(maTK),
                message: null,
                error: "Họ tên chỉ chứa chữ và khoảng trắng",
            })
        }
        if (sdt === "") {
            return res.render("khachhang/thongtintaikhoan", {
                profile: await KhachHang.findByMaTK(maTK),
                message: null,
                error: "Số điện thoại không được để trống",
            })
        }
        

        if (!/^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/.test(sdt)) {
            return res.render("khachhang/thongtintaikhoan", {
                profile: await KhachHang.findByMaTK(maTK),
                message: null,
                error: "Số điện thoại không hợp lệ !",
            })
        }


        
        // cập nhật bảng KhachHang
        await KhachHang.updateByMaTK(maTK, {
            HoTen: hoTen.trim(),
            SoDienThoai: sdt.trim(),
            GioiTinh: gioiTinh.trim(),
        })

        // nếu có mật khẩu mới
        if (matKhauMoi && matKhauMoi.trim() !== "") {
    const mk = matKhauMoi.trim()

    if (mk.length < 8) {
        return res.render("khachhang/thongtintaikhoan", {
            profile: await KhachHang.findByMaTK(maTK),
            message: null,
            error: "Mật khẩu phải có ít nhất 8 ký tự.",
        })
    }

    if (!/[A-Z]/.test(mk) || !/[a-z]/.test(mk) || !/\d/.test(mk) || !/[!@#$%^&*]/.test(mk)) {
        return res.render("khachhang/thongtintaikhoan", {
            profile: await KhachHang.findByMaTK(maTK),
            message: null,
            error: "Mật khẩu phải gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        })
    }

    if (/\s/.test(mk)) {
        return res.render("khachhang/thongtintaikhoan", {
            profile: await KhachHang.findByMaTK(maTK),
            message: null,
            error: "Mật khẩu không được chứa khoảng trắng.",
        })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(mk, salt)
    await TaiKhoan.updatePasswordByMaTK(maTK, hash)
}

        const profile = await KhachHang.findByMaTK(maTK)

        res.render("khachhang/thongtintaikhoan", {
            profile,
            message: "Cập nhật thành công.",
            error: null,
        })
    } catch (err) {
        console.error(err)
        res.render("khachhang/thongtintaikhoan", {
            profile: null,
            message: null,
            error: "Có lỗi khi cập nhật thông tin.",
        })
    }
}
