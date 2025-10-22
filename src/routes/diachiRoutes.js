const express = require('express');
const router = express.Router();
const diachiController = require('../controllers/diachiController');

// Lấy danh sách tỉnh
router.get('/tinhs', diachiController.getTinhs);

// Lấy danh sách xã theo mã tỉnh
router.get('/xas/:maTinh', diachiController.getXasByTinh);

module.exports = router;
