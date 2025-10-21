const express = require('express');
const router = express.Router();

const dangkyController = require('../controllers/dangkyController');
const dangnhapController = require('../controllers/dangnhapController');
const quanlytaikhoanContronller = require('../controllers/quanlythongtinController');
const isAuthenticated = require('../middlewares/auth').isAuthenticated;

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
// Quản lý tài khoản
router.get('/thongtintaikhoan', isAuthenticated, quanlytaikhoanContronller.getTaiKhoanView);
router.post('/thongtintaikhoan', isAuthenticated, quanlytaikhoanContronller.postCapNhatTaiKhoan);

module.exports = router;
