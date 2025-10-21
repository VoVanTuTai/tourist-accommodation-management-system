// src/middlewares/auth.js
module.exports.isAuthenticated = function (req, res, next) {
  try {
    if (req.session && (req.session.MaTaiKhoan || (req.session.user && req.session.user.MaTaiKhoan))) {
      return next();
    }
    // Chuyển hướng trang đăng nhập (tùy tuyến)
    return res.redirect('/khachhang/dangnhap');
  } catch (e) {
    return res.redirect('/khachhang/dangnhap');
  }
};
