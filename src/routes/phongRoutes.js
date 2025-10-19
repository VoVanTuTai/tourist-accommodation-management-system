const express = require("express");
const router = express.Router();
const phongController = require("../controllers/phongController");

// Hiển thị danh sách phòng
router.get("/", phongController.renderPhongList);

// Hiển thị form thêm phòng
router.get("/add", phongController.renderAddPhong);

// Xử lý form thêm phòng
router.post("/add", phongController.handleAddPhong);

module.exports = router;
