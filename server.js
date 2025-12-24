const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const flash = require("express-flash");



const app = express();

/* =====================================================
   ✅ IMPORT CÁC ROUTES
===================================================== */
const homeRoutes = require("./src/routes/homeRoutes");
const phongRoutes = require("./src/routes/phongRoutes");
const khachhangRoutes = require("./src/routes/khachhangRoutes");
const timkiemRoutes = require("./src/routes/timkiemRoutes");
const diachiRoutes = require("./src/routes/diachiRoutes");
const loaiphongRoutes = require("./src/routes/loaiphongRoutes");
const nhaCungCapRoutes = require("./src/routes/nhaCungCapRoutes");
const datPhongRoutes = require("./src/routes/datPhongRoutes");
const adminRoutes = require('./src/routes/adminRoutes')
const reportRoutes = require("./src/routes/reportRoutes");

const vnpayRoutes = require("./src/routes/vnpayRoutes");
/* =====================================================
   ✅ THIẾT LẬP EJS + LAYOUT
===================================================== */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.set('trust proxy', 1);
app.use(expressLayouts);

/* =====================================================
   ✅ MIDDLEWARE CƠ BẢN
===================================================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.use(express.static(path.join(__dirname, "./src/public")));
// STATIC MAIN
app.use(express.static(path.join(__dirname, "src/public")));

// STATIC cho folder ảnh đánh giá
app.use("/images/danhgia", express.static(path.join(__dirname, "src/public/images/danhgia")));

/* =====================================================
   ✅ CẤU HÌNH MYSQL + SESSION
===================================================== */
const dbConfig = {
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
 };

const sessionStore = new MySQLStore(dbConfig);

app.use(
  session({
    key: "thieunu_session",
    secret: "thieunu_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }, // 2 tiếng
  })
);

app.use(flash());
app.use((req, res, next) => {
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   next();
 });
/* =====================================================
   ✅ CHO PHÉP EJS TRUY CẬP SESSION TRONG MỌI VIEW
===================================================== */
app.use((req, res, next) => {
  res.locals.session = req.session || {};
  next();
});
// ✅ Thêm đoạn này để truyền session tới tất cả view
/* =====================================================
   ✅ ĐỊNH NGHĨA ROUTES
===================================================== */
app.use("/", homeRoutes);
// ✅ Sử dụng routes
app.use('/admin', adminRoutes);

app.use('/khachhang', khachhangRoutes);
// Routes
app.use("/phong", phongRoutes);
app.use("/timkiem", timkiemRoutes);
app.use("/api", diachiRoutes);
app.use("/api/loaiphong", loaiphongRoutes);

// 🧭 Route khách hàng
app.use("/khachhang", khachhangRoutes);
app.use("/khachhang", datPhongRoutes);

// 🧱 Route nhà cung cấp
app.use("/nhacungcap", nhaCungCapRoutes);

// 🛠️ Route admin
app.use('/admin', adminRoutes);
/* =====================================================
   ✅ ROUTE THANH TOÁN VNPAY
===================================================== */

app.use("/api/reports", reportRoutes);

app.use('/vnpay', vnpayRoutes);
/* =====================================================
   ✅ KHỞI ĐỘNG SERVER
===================================================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
