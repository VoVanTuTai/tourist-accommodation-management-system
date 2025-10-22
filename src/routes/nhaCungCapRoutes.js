const express = require("express");
const router = express.Router();
const nhaCungCapController = require("../controllers/nhaCungCapController");
const uploadImage = require('../middlewares/upload');

// ================= ROUTES =================

router.get("/dangky", nhaCungCapController.renderDangKyNhaCungCap);
router.post(
    "/dangky",
    uploadImage.single('GiayPhepKD'),
    nhaCungCapController.registerNhaCungCap,
);

router.get("/dangnhap", nhaCungCapController.renderDangNhapNhaCungCap);

module.exports = router;
