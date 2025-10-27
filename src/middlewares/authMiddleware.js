module.exports = {
  ensureKhachHang: (req, res, next) => {
    if (!req.session.user) {
      //  Lưu URL hiện tại để quay lại sau khi đăng nhập
      req.session.redirectAfterLogin = req.originalUrl;

      //  Thông báo yêu cầu đăng nhập
      return res.redirect("/khachhang/dangnhap?error=Vui lòng đăng nhập để tiếp tục đặt phòng");
    }
    next();
  },
};
