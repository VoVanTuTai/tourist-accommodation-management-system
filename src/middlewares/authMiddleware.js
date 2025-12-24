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
  // ✅ Kiểm tra quyền Nhà cung cấp
  ensureNhaCungCap: (req, res, next) => {
    // 1. Kiểm tra xem đã đăng nhập chưa
    if (!req.session.user) {
      req.session.redirectAfterLogin = req.originalUrl;
      return res.redirect("/nhacungcap/dangnhap?error=Vui lòng đăng nhập quyền Nhà cung cấp");
    }

    // 2. Kiểm tra vai trò (Giả định cột vai trò trong DB của bạn tên là 'Role')
    // 'nhacungcap' phải khớp chính xác với giá trị bạn lưu trong Database khi login
    if (req.session.user.PhanQuyen !== 'NhaCungCap') {
      return res.send(`
        <script>
          alert("❌ Truy cập bị từ chối! Khu vực này chỉ dành cho Nhà cung cấp.");
          window.location.href = "/nhacungcap/dangnhap";
        </script>
      `);
    }

    // Nếu mọi thứ ổn, cho phép đi tiếp
    next();
  }
};
