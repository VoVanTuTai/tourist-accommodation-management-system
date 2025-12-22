// src/routes/vnpayRoutes.js
const express = require('express');
const router = express.Router();

// ⚠️ Import chính xác đường dẫn controller (điều chỉnh nếu cần)
const paymentController = require('../controllers/paymentController');

// Debug để chắc chắn controller có hàm
console.log('Payment Controller:', paymentController);

// ✅ Route tạo thanh toán VNPay
router.post('/create_payment', (req, res) => paymentController.createPayment(req, res));

// ✅ Route VNPay trả kết quả về
router.get('/return', (req, res) => paymentController.vnpayReturn(req, res));


module.exports = router;
