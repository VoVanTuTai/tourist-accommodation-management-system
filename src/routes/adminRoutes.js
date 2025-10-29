const express = require('express');
const router = express.Router();

const authAdmin = require('../middlewares/authAdmin'); // ✅ import middleware

const customerController = require('../controllers/qlCustomerController');
const providerController = require('../controllers/providerController');
const dashboardController = require('../controllers/adminDashboardController');

// ✅ Áp dụng middleware cho toàn bộ router này
router.use(authAdmin);

// Trang chủ admin
router.get('/dashboard', dashboardController.viewDashboard);
router.get('/', dashboardController.viewDashboard);

// Quản lý khách hàng
router.get('/customers', customerController.listCustomers);
router.get('/customers/detail/:id', customerController.getCustomerDetail);
router.post('/customers/update', customerController.updateStatus);

// Quản lý nhà cung cấp
router.get('/providers', providerController.getAllProviders);
router.get('/providers/filter', providerController.filterProviders);
router.post('/providers/update', providerController.updateProviderStatus);

// Xuất báo cáo
router.get('/dashboard/export', dashboardController.exportPDF);
router.get('/dashboard/export-excel', dashboardController.exportExcel);

module.exports = router;
