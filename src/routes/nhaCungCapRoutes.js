const express = require("express");
const router = express.Router();
const multer = require("multer");
const phongController = require("../controllers/phongController");
const nhaCungCapController = require("../controllers/nhaCungCapController");
const donDatPhongController = require("../controllers/donDatPhongController");
const path = require("path");


const uploadImage = require("../middlewares/upload");

// ===== Cấu hình Multer để lưu nhiều ảnh =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Giới hạn upload tối đa 10 ảnh
const upload = multer({ storage });

// ================= ROUTES =================

// 🧾 Nhà cung cấp đăng ký
router.get("/dangky", nhaCungCapController.renderDangKyNhaCungCap);
router.post(
  "/dangky",
  uploadImage.single("GiayPhepKD"),
  nhaCungCapController.registerNhaCungCap
);
router.get("/",nhaCungCapController.renderDashboard)

router.get("/dangnhap", nhaCungCapController.renderDangNhapNhaCungCap);
router.post("/dangnhap", nhaCungCapController.loginNhaCungCap);

//Danh sách phòng
router.get("/phong", phongController.renderDanhSachPhongCuaNhaCungCap);
//Thêm phòng
router.get("/phong/them", phongController.renderThemPhong);
router.post("/phong/them", upload.array("HinhAnh", 10), phongController.handleThemPhong);
//Sửa phòng
router.get("/phong/suaphong/:id", phongController.renderSuaPhong);
router.post("/phong/suaphong/:id", upload.array("HinhAnh", 10), phongController.handleSuaPhong);
//Cập nhật trạng thái
router.get("/phong/trangthai/:id", phongController.renderUpdateStatus);
router.post("/phong/trangthai/:id", phongController.handleUpdateStatus);
//Xem chi tiết phòng (dành cho NCC)
router.get("/phong/chitiet/:id", phongController.renderChiTietPhong);

// 1. Danh sách đơn đặt phòng của NCC
router.get("/don-dat-phong", donDatPhongController.renderDanhSachDonDatPhongNCC); 

// 2. Xem chi tiết đơn đặt phòng của NCC
router.get("/don-dat-phong/chitiet/:id", donDatPhongController.renderChiTietDonDatPhongNCC); 

// 3. Xử lý Cập nhật trạng thái đơn đặt phòng (POST)
router.post("/don-dat-phong/capnhat-trangthai/:id", donDatPhongController.handleCapNhatTrangThaiDonDatPhongNCC);
module.exports = router;
