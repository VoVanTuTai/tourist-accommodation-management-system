module.exports = {
    ensureKhachHang: (req, res, next) => {
      if (!req.session.user) {
        return res.redirect("/khachhang/dangnhap");
      }
      next();
    },
  };
  