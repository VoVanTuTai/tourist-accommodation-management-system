const express = require("express");
const router = express.Router();
const multer = require("multer");
const phongController = require("../controllers/phongController");
const nhaCungCapController = require("../controllers/nhaCungCapController");


const uploadImage = require("../middlewares/upload");

// ================= CẤU HÌNH UPLOAD ẢNH =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/public/images"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ================= ROUTES =================

// 🧾 Nhà cung cấp đăng ký
router.get("/dangky", nhaCungCapController.renderDangKyNhaCungCap);
router.post(
  "/dangky",
  uploadImage.single("GiayPhepKD"),
  nhaCungCapController.registerNhaCungCap
);

// 🔑 Nhà cung cấp đăng nhập
router.get("/dangnhap", nhaCungCapController.renderDangNhapNhaCungCap);

// ================== QUẢN LÝ PHÒNG ==================

// 📋 Danh sách phòng
router.get("/phong", phongController.renderDanhSachPhongCuaNhaCungCap);

// ➕ Thêm phòng
router.get("/phong/them", phongController.renderThemPhong);
router.post("/phong/them", upload.single("HinhAnh"), phongController.handleThemPhong);

// ✏️ Sửa phòng
router.get("/phong/suaphong/:id", phongController.renderSuaPhong);
router.post("/phong/suaphong/:id", upload.single("HinhAnh"), phongController.handleSuaPhong);

// 🔁 Cập nhật trạng thái
router.get("/phong/trangthai/:id", phongController.renderUpdateStatus);
router.post("/phong/trangthai/:id", phongController.handleUpdateStatus);

// 👁️ Xem chi tiết phòng (dành cho NCC)
router.get("/phong/chitiet/:id", phongController.renderChiTietPhong);
module.exports = router;
