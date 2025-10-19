const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const phongRoutes = require("./src/routes/phongRoutes");

const app = express();

// Thiết lập EJS + Layout
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(expressLayouts);
app.set("layout", "layout"); // layout mặc định: src/views/layout.ejs

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "src", "public")));

// Routes
app.use("/phong", phongRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại: http://localhost:${PORT}`));
