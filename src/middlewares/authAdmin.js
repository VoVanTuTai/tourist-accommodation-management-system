// src/middlewares/authAdmin.js
module.exports = (req, res, next) => {
  // Nếu chưa đăng nhập → quay về trang đăng nhập
  if (!req.session.user) {
    req.session.redirectAfterLogin = req.originalUrl;
    return res.redirect("/khachhang/dangnhap?error=Vui lòng đăng nhập trước!");
  }

  // Nếu không phải admin → hiển thị trang lỗi ngay tại /admin
  if (req.session.user.PhanQuyen !== "Admin") {
    return res.render("admin/error", {
      title: "Truy cập bị từ chối",
      message: "⛔ Bạn không có quyền truy cập khu vực quản trị!",
      user: req.session.user
    });
  }

  // Nếu hợp lệ → cho phép truy cập
  next();
};
