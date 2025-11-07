const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// ===== Import Controllers =====
const phongController = require("../controllers/phongController");
const chitietphongController = require("../controllers/chitietphongController");



// ================= ROUTES =================

// 🏠 Xem chi tiết phòng (cho khách hàng / nhà cung cấp)
router.get("/chi-tiet/:maPhong", chitietphongController.xemChiTietPhong);

// 📋 Danh sách tất cả phòng (cho khách hàng)
router.get("/", phongController.renderPhongList);


module.exports = router;
