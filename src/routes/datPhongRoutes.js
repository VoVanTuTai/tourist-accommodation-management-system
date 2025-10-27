const express = require("express");
const router = express.Router();
const datPhongController = require("../controllers/datPhongController");
const { ensureKhachHang } = require("../middlewares/authMiddleware");

//  Chặn nếu chưa đăng nhập
router.get("/dat-phong/:maPhong", ensureKhachHang, datPhongController.renderForm);
router.post("/dat-phong/preview", ensureKhachHang, datPhongController.previewConfirm);
router.post("/dat-phong/xac-nhan", ensureKhachHang, datPhongController.confirmBooking);

module.exports = router;
