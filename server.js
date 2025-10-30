const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const adminRoutes = require('./src/routes/adminRoutes')

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

/* =====================================================
   ✅ THIẾT LẬP EJS + LAYOUT
===================================================== */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(expressLayouts);

/* =====================================================
   ✅ MIDDLEWARE CƠ BẢN
===================================================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./src/public")));

/* =====================================================
   ✅ CẤU HÌNH MYSQL + SESSION
===================================================== */
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "quanlidatphong",
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

/* =====================================================
   ✅ CHO PHÉP EJS TRUY CẬP SESSION TRONG MỌI VIEW
===================================================== */
app.use((req, res, next) => {
  res.locals.session = req.session || {};
  next();
});

/* =====================================================
   ✅ GIẢ LẬP NHÀ CUNG CẤP (TẠM THỜI ĐỂ TEST)
   ⚠️ Đặt TRƯỚC khi dùng route /nhacungcap
===================================================== */
// app.use((req, res, next) => {
//   if (!req.session.user) {
//     req.session.user = {
//       MaNCC: 1,
//       TenNCC: "Khách sạn Hoàng Gia",
//       Email: "hoanggia@example.com",
//       PhanQuyen: "KhachHang",
//       MaKhachHang: 1
//     };
//   }
//   next();
// });

/* =====================================================
   ✅ ĐỊNH NGHĨA ROUTES
===================================================== */
app.use("/", homeRoutes);
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
   ✅ KHỞI ĐỘNG SERVER
===================================================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
