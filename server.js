const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const phongRoutes = require("./src/routes/phongRoutes");
const homeRoutes = require("./src/routes/homeRoutes");
const session = require('express-session');
<<<<<<< HEAD

const MySQLStore = require('express-mysql-session')(session);
=======
const MySQLStore = require('express-mysql-session')(session);
const app = express();
>>>>>>> 1fdb5ff3eda91962aeb7e63361f6a430cd7a772c
// ✅ Import routes
const khachhangRoutes = require('./src/routes/khachhangRoutes');
// Thiết lập EJS + Layout
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(expressLayouts);
app.set('layout extractLocals', true);
//app.set("layout", "layout"); // layout mặc định: src/views/layout.ejs

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));
app.use("/", homeRoutes);
<<<<<<< HEAD


=======
<<<<<<< HEAD
=======
<<<<<<< Updated upstream
=======
>>>>>>> VoVanTuTai
>>>>>>> 1fdb5ff3eda91962aeb7e63361f6a430cd7a772c
// ======= Kết nối CSDL =======
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quanlidatphong'
};
// ======= Tạo session store =======
const sessionStore = new MySQLStore(dbConfig);
// ======= Cấu hình session =======
<<<<<<< HEAD
=======
// ======= Cấu hình session =======
>>>>>>> VoVanTuTai
app.use(
  session({
    key: 'thieunu_session',
    secret: 'thieunu_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2 // 2 tiếng
    }
  })
);
<<<<<<< HEAD
// ======= Cho phép dùng session trong EJS =======
app.use((req, res, next) => {
  res.locals.session = req.session;
=======
app.use((req, res, next) => {
  res.locals.session = req.session || {};
>>>>>>> VoVanTuTai
  next();
});

// ======= Cho phép dùng session trong EJS =======
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ✅ Sử dụng routes
app.use('/khachhang', khachhangRoutes);
// Routes
app.use("/phong", phongRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại: http://localhost:${PORT}`));
