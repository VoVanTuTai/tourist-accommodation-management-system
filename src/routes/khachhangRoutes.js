const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const { ensureKhachHang } = require("../middlewares/authMiddleware");
const danhGiaController = require("../controllers/danhGiaController");
const donDatPhongController = require("../controllers/donDatPhongController");
const dangkyController = require("../controllers/dangkyController");
const dangnhapController = require("../controllers/dangnhapController");
const datPhongController = require('../controllers/datPhongController');
// =====================================================
// 🔐 XÁC THỰC NGƯỜI DÙNG (ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT)
// =====================================================
router.get("/dangky", dangkyController.getRegisterPage);
router.post("/dangky", dangkyController.register);

router.get("/dangnhap", dangnhapController.getLoginPage);
router.post("/dangnhap", dangnhapController.login);

router.get("/dangxuat", dangnhapController.logout);
// 1️⃣ Danh sách đơn
router.get("/don-dat-phong", ensureKhachHang, donDatPhongController.danhSachDonDatPhong);
// 2️⃣ Chi tiết đơn
router.get("/don-dat-phong/:id", ensureKhachHang, donDatPhongController.chiTietDonDatPhong);
// Thêm dòng này
router.post('/dat-phong/confirm', datPhongController.confirmBooking);
// 3️⃣ Hủy đơn (POST để tránh lỗi GET reload)
router.post("/don-dat-phong/huy/:id", ensureKhachHang, donDatPhongController.huyDonDatPhong);
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
router.post("/don-dat-phong/:maDon/danhgia", ensureKhachHang, upload.array("HinhAnh", 3), danhGiaController.handleDanhGia );
const quanlytaikhoanContronller = require('../controllers/quanlythongtinController');
const isAuthenticated = require('../middlewares/auth').isAuthenticated;
// Quản lý tài khoản
router.get('/thongtintaikhoan', isAuthenticated, quanlytaikhoanContronller.getTaiKhoanView);
router.post('/thongtintaikhoan', isAuthenticated, quanlytaikhoanContronller.postCapNhatTaiKhoan);
module.exports = router;
