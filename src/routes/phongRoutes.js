const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const phongController = require("../controllers/phongController");

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

// Danh sách
router.get("/", phongController.renderPhongList);


module.exports = router;
