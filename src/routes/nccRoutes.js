const express = require("express");
const router = express.Router();
const multer = require("multer");
const nccPhongController = require("../controllers/nccPhongController");

// ⚙️ Cấu hình upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/public/images"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 📌 Danh sách phòng
router.get("/phong", nccPhongController.renderDanhSachPhong);

// 📌 Thêm phòng
router.get("/phong/them", nccPhongController.renderThemPhong);
router.post("/phong/them", upload.single("HinhAnh"), nccPhongController.handleThemPhong);

// 📌 Sửa phòng
router.get("/phong/sua/:id", nccPhongController.renderSuaPhong);
router.post("/phong/sua/:id", upload.single("HinhAnh"), nccPhongController.handleSuaPhong);

// 📌 Cập nhật trạng thái
router.get("/phong/trangthai/:id", nccPhongController.renderCapNhatTrangThai);
router.post("/phong/trangthai/:id", nccPhongController.handleCapNhatTrangThai);

module.exports = router;
