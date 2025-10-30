const fs = require("fs");
const path = require("path");
const PdfPrinter = require("pdfmake/src/printer");
const ExcelJS = require("exceljs");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");

const Customer = require("../models/QLcustomerModel");
const Provider = require("../models/providerModel");

// ==================== FONT HỖ TRỢ TIẾNG VIỆT ====================
const fonts = {
  Arial: {
    normal: "C:\\Windows\\Fonts\\arial.ttf",
    bold: "C:\\Windows\\Fonts\\arialbd.ttf",
    italics: "C:\\Windows\\Fonts\\ariali.ttf",
    bolditalics: "C:\\Windows\\Fonts\\arialbi.ttf"
  }
};

// ==================== HÀM SINH TIMESTAMP ====================
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
}

// ==================== HÀM TẠO ẢNH BIỂU ĐỒ BASE64 ====================
async function createChartBase64(type, labels, data, colors, title) {
  const width = 600;
  const height = 400;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const config = {
    type,
    data: {
      labels,
      datasets: [
        {
          label: title,
          data,
          backgroundColor: colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      plugins: {
        title: { display: true, text: title, font: { size: 16 } },
        legend: { position: "bottom" }
      }
    }
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  return buffer.toString("base64");
}

// ==================== TRANG DASHBOARD HIỂN THỊ ====================
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

    res.render("admin/dashboard", { customerStats, providerStats });
  } catch (err) {
    console.error("❌ Lỗi hiển thị dashboard:", err);
    res.status(500).send("Không thể tải trang thống kê!");
  }
};

// ==================== XUẤT PDF (CÓ BIỂU ĐỒ) ====================
exports.exportPDF = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    const providers = await Provider.getAllProviders();

    const stats = {
      customer: {
        total: customers.length,
        active: customers.filter(c => c.TrangThai === "HoatDong").length,
        locked: customers.filter(c => c.TrangThai === "Khoa").length
      },
      provider: {
        total: providers.length,
        active: providers.filter(p => p.TrangThai === "HoatDong").length,
        locked: providers.filter(p => p.TrangThai === "Khoa").length,
        pending: providers.filter(p => p.TrangThai === "ChoDuyet").length
      }
    };

    // === TẠO HÌNH BIỂU ĐỒ ===
    const chartCustomer = await createChartBase64(
      "doughnut",
      ["Đang hoạt động", "Đã khóa"],
      [stats.customer.active, stats.customer.locked],
      ["#28a745", "#dc3545"],
      "Thống kê khách hàng"
    );

    const chartProvider = await createChartBase64(
      "bar",
      ["Đang hoạt động", "Đã khóa", "Chờ duyệt"],
      [stats.provider.active, stats.provider.locked, stats.provider.pending],
      ["#28a745", "#dc3545", "#ffc107"],
      "Thống kê nhà cung cấp"
    );

    // === TẠO FILE PDF ===
    const printer = new PdfPrinter(fonts);
    const docDefinition = {
      defaultStyle: { font: "Arial" },
      content: [
        { text: "BÁO CÁO THỐNG KÊ HỆ THỐNG DU LỊCH", style: "header" },
        { text: `Ngày xuất: ${new Date().toLocaleString("vi-VN")}`, alignment: "right", margin: [0, 5, 0, 10] },

        { image: `data:image/png;base64,${chartCustomer}`, width: 400, alignment: "center", margin: [0, 10, 0, 20] },
        { image: `data:image/png;base64,${chartProvider}`, width: 450, alignment: "center", margin: [0, 10, 0, 20] },

        { text: "BẢNG TỔNG HỢP THỐNG KÊ", style: "subheader" },
        {
          table: {
            widths: ["*", "auto", "auto"],
            body: [
              ["Loại", "Số lượng", "Trạng thái"],
              ["Khách hàng (hoạt động)", stats.customer.active, "Hoạt động"],
              ["Khách hàng (khóa)", stats.customer.locked, "Khóa"],
              ["Nhà cung cấp (hoạt động)", stats.provider.active, "Hoạt động"],
              ["Nhà cung cấp (chờ duyệt)", stats.provider.pending, "Chờ duyệt"],
              ["Nhà cung cấp (khóa)", stats.provider.locked, "Khóa"]
            ]
          }
        },
        { text: "\nTổng số khách hàng: " + stats.customer.total },
        { text: "Tổng số nhà cung cấp: " + stats.provider.total },
        { text: "\n\n© 2025 Tourist Accommodation Management System", alignment: "center", italics: true }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: "center", margin: [0, 10, 0, 20] },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 10] }
      }
    };

    const reportsDir = path.join(__dirname, "../public/reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const fileName = `baocao_thongke_${getTimestamp()}.pdf`;
    const filePath = path.join(reportsDir, fileName);

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const stream = fs.createWriteStream(filePath);
    pdfDoc.pipe(stream);
    pdfDoc.end();

    stream.on("finish", () => res.download(filePath, fileName));
  } catch (err) {
    console.error("❌ Lỗi xuất PDF:", err);
    res.status(500).send("Không thể xuất PDF!");
  }
};

// ==================== XUẤT EXCEL ====================
exports.exportExcel = async (req, res) => {
  try {
    const customers = await Customer.getAllCustomers();
    const providers = await Provider.getAllProviders();

    const workbook = new ExcelJS.Workbook();
    const sheet1 = workbook.addWorksheet("Khách hàng");
    const sheet2 = workbook.addWorksheet("Nhà cung cấp");

    // --- Sheet khách hàng ---
    sheet1.columns = [
      { header: "Mã KH", key: "MaKhachHang", width: 10 },
      { header: "Họ tên", key: "HoTen", width: 25 },
      { header: "Email", key: "Email", width: 25 },
      { header: "SĐT", key: "SoDienThoai", width: 15 },
      { header: "Trạng thái", key: "TrangThai", width: 20 }
    ];
    sheet1.addRows(customers);

    // --- Sheet nhà cung cấp ---
    sheet2.columns = [
      { header: "Mã NCC", key: "MaNCC", width: 10 },
      { header: "Tên NCC", key: "TenNCC", width: 25 },
      { header: "Loại hình", key: "LoaiHinh", width: 20 },
      { header: "Trạng thái", key: "TrangThai", width: 20 }
    ];
    sheet2.addRows(providers);

    const reportsDir = path.join(__dirname, "../public/reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

    const fileName = `baocao_thongke_${getTimestamp()}.xlsx`;
    const filePath = path.join(reportsDir, fileName);

    await workbook.xlsx.writeFile(filePath);
    res.download(filePath, fileName);
  } catch (err) {
    console.error("❌ Lỗi xuất Excel:", err);
    res.status(500).send("Không thể xuất Excel!");
  }
};
