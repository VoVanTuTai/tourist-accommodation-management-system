const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

// ====== Import routes ======
const homeRoutes = require("./src/routes/homeRoutes");
const phongRoutes = require("./src/routes/phongRoutes");
const khachhangRoutes = require("./src/routes/khachhangRoutes");
const timkiemRoutes = require("./src/routes/timkiemRoutes");
const diachiRoutes = require('./src/routes/diachiRoutes');
const loaiphongRoutes = require('./src/routes/loaiphongRoutes');
const nhaCungCapRoutes = require('./src/routes/nhaCungCapRoutes');
const app = express();

// ====== Thiết lập EJS + Layout ======
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(expressLayouts);
// Nếu bạn có layout.ejs chung, bật dòng dưới
// app.set("layout", "layout");

// ====== Middleware cơ bản ======
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));

// ====== Cấu hình kết nối MySQL + Session ======
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

// ====== Cho phép EJS truy cập session trong mọi view ======
app.use((req, res, next) => {
  res.locals.session = req.session || {};
  next();
});

// ====== Định nghĩa routes ======
app.use("/", homeRoutes);
app.use("/phong", phongRoutes);
app.use("/khachhang", khachhangRoutes);
app.use("/nhacungcap", nhaCungCapRoutes);
app.use((req, res, next) => {
  if (!req.session.ncc) {
    req.session.ncc = {
      MaNCC: 1,
      TenNCC: "Khách sạn Hoàng Gia",
      Email: "hoanggia@example.com"
    };
  }
  next();
});
app.use("/timkiem", timkiemRoutes);
app.use('/api', diachiRoutes);
app.use('/api/loaiphong', loaiphongRoutes);
app.use("/nhacungcap", nhaCungCapRoutes);
// ====== Khởi động server ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`🚀 Server chạy tại: http://localhost:${PORT}`)
);

