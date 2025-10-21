const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const phongRoutes = require("./src/routes/phongRoutes");
const homeRoutes = require("./src/routes/homeRoutes");
const nhaCungCapRoutes = require("./src/routes/nhaCungCapRoutes"); // ✅ Import nhà cung cấp routes

// ✅ Import routes
const khachhangRoutes = require('./src/routes/khachhangRoutes');
const app = express();

// Thiết lập EJS + Layout
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(expressLayouts);
//app.set("layout", "layout"); // layout mặc định: src/views/layout.ejs

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));
app.use("/", homeRoutes);


// ✅ Sử dụng routes
app.use('/khachhang', khachhangRoutes);
// Routes
app.use("/phong", phongRoutes);
app.use("/nhacungcap", nhaCungCapRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại: http://localhost:${PORT}`));
