const express = require("express");
const router = express.Router();
const multer = require("multer");

const nhaCungCapController = require("../controllers/nhaCungCapController");
const nccPhongController = require("../controllers/nccPhongController");
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

// 📋 Danh sách phòng của NCC
router.get("/phong", nccPhongController.renderDanhSachPhong);

// ➕ Thêm phòng
router.get("/phong/them", nccPhongController.renderThemPhong);
router.post("/phong/them", upload.single("HinhAnh"), nccPhongController.handleThemPhong);

// ✏️ Sửa phòng
router.get("/phong/suaphong/:id", nccPhongController.renderSuaPhong);
router.post("/phong/suaphong/:id", upload.single("HinhAnh"), nccPhongController.handleSuaPhong);

// 🔁 Cập nhật trạng thái phòng (Hoạt động / Bảo trì / Hết chỗ)
router.get("/phong/trangthai/:id", nccPhongController.renderCapNhatTrangThai);
router.post("/phong/trangthai/:id", nccPhongController.handleCapNhatTrangThai);

module.exports = router;
