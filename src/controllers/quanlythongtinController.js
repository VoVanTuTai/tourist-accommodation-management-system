// src/controllers/khachhangController.js
const bcrypt = require("bcryptjs")
const KhachHang = require("../models/KhachHang")
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

        if (!/^[A-Za-zÀ-ỹ\s]+$/.test(hoTen)) {
            return res.render("khachhang/thongtintaikhoan", {
                profile: await KhachHang.findByMaTK(maTK),
                message: null,
                error: "Họ tên chỉ chứa chữ và khoảng trắng",
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
