const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const { ensureKhachHang } = require("../middlewares/authMiddleware");
const danhGiaController = require("../controllers/danhGiaController");
const donDatPhongController = require("../controllers/donDatPhongController");
const dangkyController = require("../controllers/dangkyController");
const dangnhapController = require("../controllers/dangnhapController");
// =====================================================
// 🔐 XÁC THỰC NGƯỜI DÙNG (ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT)
// =====================================================
router.get("/dangky", dangkyController.getRegisterPage);
router.post("/dangky", dangkyController.register);

router.get("/dangnhap", dangnhapController.getLoginPage);
router.post("/dangnhap", dangnhapController.login);

router.get("/dangxuat", dangnhapController.logout);

// =====================================================
// 🏨 QUẢN LÝ ĐƠN ĐẶT PHÒNG (YÊU CẦU ĐĂNG NHẬP)
// =====================================================

// 1️⃣ Danh sách đơn
router.get("/don-dat-phong", ensureKhachHang, donDatPhongController.danhSachDonDatPhong);

// 2️⃣ Chi tiết đơn
router.get("/don-dat-phong/:id", ensureKhachHang, donDatPhongController.chiTietDonDatPhong);

// 3️⃣ Hủy đơn (POST để tránh lỗi GET reload)
router.post("/don-dat-phong/huy/:id", ensureKhachHang, donDatPhongController.huyDonDatPhong);

// =====================================================
// 💳 THANH TOÁN
// =====================================================

// Hiển thị trang thanh toán
router.get("/don-dat-phong/thanhtoan/:id", ensureKhachHang, donDatPhongController.renderThanhToan);

// Xử lý thanh toán
router.post("/don-dat-phong/thanhtoan", ensureKhachHang, donDatPhongController.handleThanhToan);

// =====================================================
// ⭐ ĐÁNH GIÁ PHÒNG
// =====================================================
// ✅ CẤU HÌNH MULTER CHO ẢNH ĐÁNH GIÁ
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/images/danhgia")),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });
router.get("/don-dat-phong/:maDon/danhgia", ensureKhachHang, danhGiaController.renderDanhGia);
router.post("/don-dat-phong/:maDon/danhgia", ensureKhachHang, upload.single("HinhAnh"), danhGiaController.handleDanhGia);




module.exports = router;
