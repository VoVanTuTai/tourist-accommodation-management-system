const express = require("express");
const router = express.Router();

const authAdmin = require("../middlewares/authAdmin");

const customerController = require("../controllers/qlCustomerController");
const providerController = require("../controllers/providerController");
const dashboardController = require("../controllers/adminDashboardController");
const reportController = require("../controllers/reportController");

// ================= MIDDLEWARE =================
router.use(authAdmin);

// ================= DASHBOARD =================
router.get("/", dashboardController.viewDashboard);
router.get("/dashboard", dashboardController.viewDashboard);

// ================= CUSTOMER =================
router.get("/customers", customerController.listCustomers);
router.get("/customers/detail/:id", customerController.getCustomerDetail);
router.post("/customers/update", customerController.updateStatus);

// ================= PROVIDER =================
router.get("/providers", providerController.getAllProviders);
router.get("/providers/filter", providerController.filterProviders);
router.post("/providers/update", providerController.updateProviderStatus);

// ================= DASHBOARD EXPORT =================
router.get("/dashboard/export", dashboardController.exportPDF);
router.get("/dashboard/export-excel", dashboardController.exportExcel);

// ================= COMMISSION VIEW =================
router.get("/commission", (req, res) => {
  res.render("admin/commission", {
    title: "Báo cáo hoa hồng"
  });
});

// ================= COMMISSION API =================
router.get(
  "/reports/commission",
  reportController.getCommissionReport
);

// ================= COMMISSION EXPORT =================
router.get(
  "/reports/commission/export/pdf",
  reportController.exportCommissionPDF
);


router.get(
  "/reports/commission/export/excel",
  reportController.exportCommissionExcel
);

module.exports = router;
