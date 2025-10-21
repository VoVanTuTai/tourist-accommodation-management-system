const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const nhaCungCapController = require("../controllers/nhaCungCapController");

// Cấu hình lưu ảnh
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

// Dang ky nha cung cap
router.get("/dangky", nhaCungCapController.renderDangKyNhaCungCap);
router.post("/dangky", nhaCungCapController.registerNhaCungCap);

module.exports = router;
