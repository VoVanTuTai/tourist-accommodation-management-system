const express = require('express');
const router = express.Router();

const dangkyController = require('../controllers/dangkyController');
const dangnhapController = require('../controllers/dangnhapController');

router.get('/dangky', dangkyController.getRegisterPage);
router.post('/dangky', dangkyController.register);
//router.get('/quanlytaikhoan', Controller.getAccountPage);
router.get('/dangnhap', dangnhapController.getLoginPage);
router.post('/dangnhap', dangnhapController.login);
// Đăng xuất
router.get('/dangxuat', dangnhapController.logout);
const donDatPhongController = require('../controllers/donDatPhongController');

// Danh sách đơn đặt phòng của khách
router.get('/don-dat-phong', donDatPhongController.danhSachDonDatPhong);
router.get("/don-dat-phong/:id", donDatPhongController.chiTietDonDatPhong);
router.get("/don-dat-phong/huy/:id", donDatPhongController.huyDonDatPhong);
module.exports = router;
