const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
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
const upload = multer({ storage: storage });

// ================= ROUTES =================

//  Xem chi tiết phòng — đặt TRƯỚC route "/"
router.get("/chi-tiet/:maPhong", chitietphongController.xemChiTietPhong);

//  Danh sách phòng
router.get("/", phongController.renderPhongList);

//  Thêm phòng
router.get("/add", phongController.renderAddPhong);
router.post("/add", upload.single("HinhAnh"), phongController.handleAddPhong);

//  Sửa phòng
router.get("/edit/:id", phongController.renderEditPhong);
router.post("/edit", upload.single("HinhAnh"), phongController.handleEditPhong);

//  Thay đổi trạng thái
router.get("/status/:id", phongController.renderUpdateStatus);
router.post("/status", phongController.handleUpdateStatus);

module.exports = router;
