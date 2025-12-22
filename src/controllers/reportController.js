const fs = require("fs");
const path = require("path");
const PdfPrinter = require("pdfmake/src/printer");
const ExcelJS = require("exceljs");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const reportModel = require("../models/reportModel");

// ================= FONT =================
const fonts = {
  Arial: {
    normal: "C:/Windows/Fonts/arial.ttf",
    bold: "C:/Windows/Fonts/arialbd.ttf"
  }
};

// ================= TIMESTAMP =================
function getTimestamp() {
  return new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
}

// ================= BIỂU ĐỒ =================
async function createChartBase64(labels, data) {
  const canvas = new ChartJSNodeCanvas({ width: 700, height: 400 });

  const config = {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Hoa hồng (VNĐ)",
        data,
        backgroundColor: "#0d6efd"
      }]
    }
  };

  const buffer = await canvas.renderToBuffer(config);
  return buffer.toString("base64");
}

// ================= API JSON =================
async function getCommissionReport(req, res) {
  try {
    const { from, to } = req.query;
    const rows = await reportModel.getCommissionData(from, to);

    const totalCommission = rows.reduce(
      (sum, r) => sum + Number(r.TongHoaHong || 0),
      0
    );

    res.json({ totalCommission, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// ================= PDF =================
async function exportCommissionPDF(req, res) {
  try {
    const { from, to } = req.query;
    const rows = await reportModel.getCommissionData(from, to);

    const labels = rows.map(r => r.TenNCC);
    const values = rows.map(r => r.TongHoaHong);

    const chartBase64 = await createChartBase64(labels, values);

    const printer = new PdfPrinter(fonts);
    const doc = {
      defaultStyle: { font: "Arial" },
      content: [
        { text: "BÁO CÁO HOA HỒNG", style: "header" },
        { text: `Từ ${from || "..." } đến ${to || "..."}`, margin: [0, 0, 0, 10] },
        { image: `data:image/png;base64,${chartBase64}`, width: 500 },
        {
          table: {
            widths: ["*", "auto"],
            body: [
              ["Nhà cung cấp", "Hoa hồng"],
              ...rows.map(r => [r.TenNCC, r.TongHoaHong.toLocaleString("vi-VN")])
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: "center" }
      }
    };

    const fileName = `commission_${getTimestamp()}.pdf`;
    const filePath = path.join(__dirname, "../public/reports", fileName);

    if (!fs.existsSync(path.dirname(filePath)))
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const pdfDoc = printer.createPdfKitDocument(doc);
    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.end();

    pdfDoc.on("end", () => res.download(filePath, fileName));
  } catch (err) {
    console.error(err);
    res.status(500).send("Không xuất được PDF");
  }
}

// ================= EXCEL =================
async function exportCommissionExcel(req, res) {
  try {
    const { from, to } = req.query;
    const rows = await reportModel.getCommissionData(from, to);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Hoa hồng");

    ws.addRow([`Từ ${from || "..."} đến ${to || "..."}`]);
    ws.addRow([]);
    ws.addRow(["Nhà cung cấp", "Hoa hồng (VNĐ)"]);

    rows.forEach(r => ws.addRow([r.TenNCC, r.TongHoaHong]));

    const fileName = `commission_${getTimestamp()}.xlsx`;
    const filePath = path.join(__dirname, "../public/reports", fileName);

    await wb.xlsx.writeFile(filePath);
    res.download(filePath, fileName);
  } catch (err) {
    console.error(err);
    res.status(500).send("Không xuất được Excel");
  }
}

// ================= EXPORT CHUẨN =================
module.exports = {
  getCommissionReport,
  exportCommissionPDF,
  exportCommissionExcel
};
