const express = require('express');
const router = express.Router();
const donDatPhongController = require('../controllers/donDatPhongController');

// Danh sách đơn đặt phòng của khách
router.get('/don-dat-phong', donDatPhongController.danhSachDonDatPhong);
router.get("/don-dat-phong/:id", donDatPhongController.chiTietDonDatPhong);
router.get("/don-dat-phong/huy/:id", donDatPhongController.huyDonDatPhong);
module.exports = router;
