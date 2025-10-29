const express = require('express');
const router = express.Router();
const customerController = require('../controllers/qlCustomerController');
const providerController = require('../controllers/providerController');
const dashboardController = require('../controllers/adminDashboardController');

// Quản lý nhà cung cấp
router.get('/providers', providerController.getAllProviders);
router.get('/providers/filter', providerController.filterProviders);
router.post('/providers/update', providerController.updateProviderStatus);
router.get("/dashboard/export", dashboardController.exportPDF);
router.get("/dashboard/export-excel", dashboardController.exportExcel);

// Quản lý khách hàng
router.get("/customers", customerController.listCustomers);
router.get("/customers/detail/:id", customerController.getCustomerDetail);
router.post("/customers/update", customerController.updateStatus);


// ===== Trang chủ admin =====
router.get("/", dashboardController.viewDashboard);
router.get("/dashboard", dashboardController.viewDashboard);

// ===== Xuất báo cáo =====
router.get("/dashboard/export", dashboardController.exportPDF);
router.get("/dashboard/export-excel", dashboardController.exportExcel);

module.exports = router;