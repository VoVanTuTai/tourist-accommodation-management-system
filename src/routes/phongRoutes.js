const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// ===== Import Controllers =====
const phongController = require("../controllers/phongController");
const chitietphongController = require("../controllers/chitietphongController");

// ===== Cấu hình lưu ảnh =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ================= ROUTES =================

// 🏠 Xem chi tiết phòng — đặt TRƯỚC route "/"
router.get("/chi-tiet/:maPhong", chitietphongController.xemChiTietPhong);

// 📋 Danh sách phòng (cho khách hàng)
router.get("/", phongController.renderPhongList);

// 🏗️ Thêm phòng (cho nhà cung cấp)
router.get("/add", phongController.renderThemPhong);
router.post("/add", upload.single("HinhAnh"), phongController.handleThemPhong);

// ✏️ Sửa phòng (cho nhà cung cấp)
router.get("/edit/:id", phongController.renderSuaPhong);
router.post("/edit", upload.single("HinhAnh"), phongController.handleSuaPhong);

// 🔁 Cập nhật trạng thái phòng
router.get("/status/:id", phongController.renderUpdateStatus);
router.post("/status", phongController.handleUpdateStatus);

module.exports = router;
