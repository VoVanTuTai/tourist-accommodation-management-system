const express = require('express');
const router = express.Router();
const timkiemController = require('../controllers/timkiemController');

// Route xử lý tìm kiếm
router.get('/', timkiemController.timKiemPhong);

// Route load form (nếu muốn hiển thị riêng)

module.exports = router;
