// src/middlewares/checkRole.js
module.exports = (req, res, next) => {
  const user = req.session.user;

  // ✅ Nếu chưa đăng nhập
  if (!user) {
    return res.redirect('/home');
  }

  const role = user.PhanQuyen;
  const path = req.path.toLowerCase();
  const baseUrl = req.baseUrl.toLowerCase(); // Ví dụ: /nha-cung-cap hoặc /admin

  // ✅ Nếu là khách hàng
  if (role === 'KhachHang') {
    if (baseUrl.startsWith('/nha-cung-cap') || baseUrl.startsWith('/admin')) {
      return res.redirect('/home');
    }
  }

  // ✅ Nếu là nhà cung cấp
  if (role === 'NhaCungCap') {
    if (baseUrl.startsWith('/admin')) {
      return res.redirect('/home');
    }
  }

  // ✅ Nếu là admin
  if (role === 'Admin') {
    if (baseUrl.startsWith('/nha-cung-cap')) {
      return res.redirect('/home');
    }
  }

  // Nếu hợp lệ → cho qua
  next();
};