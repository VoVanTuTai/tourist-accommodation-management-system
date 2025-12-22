const fs = require("fs");
const path = require("path");
const PdfPrinter = require("pdfmake/src/printer");
const ExcelJS = require("exceljs");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const Customer = require("../models/QLcustomerModel");
const Provider = require("../models/providerModel");
const reportModel = require("../models/reportModel");

// ================= FONT TIẾNG VIỆT =================
const fonts = {
  Arial: {
    normal: "C:\\Windows\\Fonts\\arial.ttf",
    bold: "C:\\Windows\\Fonts\\arialbd.ttf",
    italics: "C:\\Windows\\Fonts\\ariali.ttf",
    bolditalics: "C:\\Windows\\Fonts\\arialbi.ttf"
  }
};

// ================= TIMESTAMP =================
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
}

// ================= CHART BASE64 =================
async function createChartBase64(type, labels, data, colors, title) {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 650, height: 400 });

  const config = {
    type,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 16 }
        },
        legend: { position: "bottom" }
      }
    }
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  return buffer.toString("base64");
}

// ================= DASHBOARD =================
exports.viewDashboard = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    const providers = await Provider.getAllProviders();

    const customerStats = {
      total: customers.length,
      active: customers.filter(c => c.TrangThai === "HoatDong").length,
      locked: customers.filter(c => c.TrangThai === "Khoa").length
    };

    const providerStats = {
      total: providers.length,
      active: providers.filter(p => p.TrangThai === "HoatDong").length,
      locked: providers.filter(p => p.TrangThai === "Khoa").length,
      pending: providers.filter(p => p.TrangThai === "ChoDuyet").length
    };

    // 💰 chỉ hiển thị trên dashboard
    const commissionRows = await reportModel.getCommissionData();
    const totalCommission = commissionRows.reduce(
      (sum, r) => sum + Number(r.TongHoaHong || 0),
      0
    );

    res.render("admin/dashboard", {
      customerStats,
      providerStats,
      totalCommission
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Lỗi dashboard");
  }
};

// ================= EXPORT PDF (BÁO CÁO TỔNG) =================
exports.exportPDF = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    const providers = await Provider.getAllProviders();

    // ====== THỐNG KÊ ======
    const customerStats = {
      total: customers.length,
      active: customers.filter(c => c.TrangThai === "HoatDong").length,
      locked: customers.filter(c => c.TrangThai === "Khoa").length
    };

    const providerStats = {
      total: providers.length,
      active: providers.filter(p => p.TrangThai === "HoatDong").length,
      locked: providers.filter(p => p.TrangThai === "Khoa").length,
      pending: providers.filter(p => p.TrangThai === "ChoDuyet").length
    };

    // ====== BIỂU ĐỒ ======
    const chartCustomer = await createChartBase64(
      "doughnut",
      ["Hoạt động", "Khóa"],
      [customerStats.active, customerStats.locked],
      ["#28a745", "#dc3545"],
      "Khách hàng"
    );

    const chartProvider = await createChartBase64(
      "bar",
      ["Hoạt động", "Khóa", "Chờ duyệt"],
      [providerStats.active, providerStats.locked, providerStats.pending],
      ["#28a745", "#dc3545", "#ffc107"],
      "Nhà cung cấp"
    );

    const printer = new PdfPrinter(fonts);

    // ====== NỘI DUNG PDF ======
    const docDefinition = {
      defaultStyle: { font: "Arial", fontSize: 11 },
      pageMargins: [40, 60, 40, 60],
      content: [
        // ===== HEADER =====
        { text: "HỆ THỐNG QUẢN LÝ LƯU TRÚ DU LỊCH", style: "header" },
        { text: "BÁO CÁO TỔNG HỢP DASHBOARD", style: "subheader" },
        {
          text: `Ngày xuất: ${new Date().toLocaleString("vi-VN")}`,
          alignment: "right",
          margin: [0, 0, 0, 10]
        },

        // ===== THỐNG KÊ TỔNG =====
        { text: "I. THỐNG KÊ TỔNG QUAN", style: "section" },
        {
          columns: [
            {
              width: "50%",
              table: {
                widths: ["*", "auto"],
                body: [
                  ["Tổng khách hàng", customerStats.total],
                  ["Khách hàng hoạt động", customerStats.active],
                  ["Khách hàng bị khóa", customerStats.locked]
                ]
              }
            },
            {
              width: "50%",
              table: {
                widths: ["*", "auto"],
                body: [
                  ["Tổng nhà cung cấp", providerStats.total],
                  ["Nhà cung cấp hoạt động", providerStats.active],
                  ["Nhà cung cấp chờ duyệt", providerStats.pending],
                  ["Nhà cung cấp bị khóa", providerStats.locked]
                ]
              }
            }
          ],
          margin: [0, 5, 0, 15]
        },

        // ===== BIỂU ĐỒ =====
        { text: "II. BIỂU ĐỒ THỐNG KÊ", style: "section" },
        {
          image: `data:image/png;base64,${chartCustomer}`,
          width: 300,
          alignment: "center",
          margin: [0, 10, 0, 20]
        },
        {
          image: `data:image/png;base64,${chartProvider}`,
          width: 420,
          alignment: "center",
          margin: [0, 10, 0, 20]
        },

        // ===== BẢNG CHI TIẾT =====
        { text: "III. DANH SÁCH NHÀ CUNG CẤP", style: "section" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "*", "auto"],
            body: [
              ["Mã NCC", "Tên NCC", "Loại hình", "Trạng thái"],
              ...providers.map(p => [
                p.MaNCC,
                p.TenNCC,
                p.LoaiHinh,
                p.TrangThai
              ])
            ]
          },
          layout: "lightHorizontalLines"
        },

        // ===== FOOTER =====
        {
          text: "\nNgười lập báo cáo\n(Ký & ghi rõ họ tên)",
          alignment: "right",
          margin: [0, 30, 0, 0]
        }
      ],

      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 5]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 15]
        },
        section: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 8]
        }
      }
    };

    // ====== GHI FILE ======
    const reportsDir = path.join(__dirname, "../public/reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const fileName = `baocao_dashboard_${getTimestamp()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.end();

    pdfDoc.on("end", () => res.download(filePath, fileName));
  } catch (err) {
    console.error("❌ PDF error:", err);
    res.status(500).send("Không thể xuất PDF");
  }
};


// ================= EXPORT EXCEL (BÁO CÁO TỔNG) =================
exports.exportExcel = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    const providers = await Provider.getAllProviders();

    const workbook = new ExcelJS.Workbook();

    // ===== SHEET KHÁCH HÀNG =====
    const sheetCustomer = workbook.addWorksheet("Khách hàng");
    sheetCustomer.columns = [
      { header: "Mã KH", key: "MaKhachHang", width: 12 },
      { header: "Họ tên", key: "HoTen", width: 25 },
      { header: "Email", key: "Email", width: 25 },
      { header: "Trạng thái", key: "TrangThai", width: 15 }
    ];
    sheetCustomer.addRows(customers);

    // ===== SHEET NHÀ CUNG CẤP =====
    const sheetProvider = workbook.addWorksheet("Nhà cung cấp");
    sheetProvider.columns = [
      { header: "Mã NCC", key: "MaNCC", width: 12 },
      { header: "Tên NCC", key: "TenNCC", width: 30 },
      { header: "Loại hình", key: "LoaiHinh", width: 20 },
      { header: "Trạng thái", key: "TrangThai", width: 15 }
    ];
    sheetProvider.addRows(providers);

    const reportsDir = path.join(__dirname, "../public/reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const fileName = `dashboard_${getTimestamp()}.xlsx`;
    const filePath = path.join(reportsDir, fileName);

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, fileName);
  } catch (err) {
    console.error("Excel error:", err);
    res.status(500).send("Không thể xuất Excel");
  }
};
