const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");

// API dữ liệu hoa hồng (JSON)
router.get("/reports/commission", reportController.getCommissionReport);

// Export PDF
router.get(
  "/reports/commission/export/pdf",
  reportController.exportCommissionPDF
);

// Export Excel
router.get(
  "/reports/commission/export/excel",
  reportController.exportCommissionExcel
);

module.exports = router;
