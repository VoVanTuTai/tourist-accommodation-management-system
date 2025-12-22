// src/middlewares/checkRole.js
module.exports = (req, res, next) => {
  const user = req.session.user;
  console.log("check role");
  
  // ✅ Nếu chưa đăng nhập
  if (!user) {
    return res.redirect('/home', {
      js: [
        "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.js",
        "/js/home/timkiem.js"
      ],
      css: [
          "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.css",
          "/css/home.css"
      ]
    });
  }

  const role = user.PhanQuyen;
  const path = req.path.toLowerCase();
  const baseUrl = req.baseUrl.toLowerCase(); // Ví dụ: /nha-cung-cap hoặc /admin

  // ✅ Nếu là khách hàng
  if (role === 'KhachHang') {
    if (baseUrl.startsWith('/nha-cung-cap') || baseUrl.startsWith('/admin')) {
      return res.redirect('/home', {
      js: [
        "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.js",
        "/js/home/timkiem.js"
      ],
      css: [
          "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.css",
          "/css/home.css"
      ]
    });
    }
  }

  // ✅ Nếu là nhà cung cấp
  if (role === 'NhaCungCap') {
    if (baseUrl.startsWith('/admin')) {
      return res.redirect('/home', {
        js: [
          "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.js",
          "/js/home/timkiem.js"
        ],
        css: [
            "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.css",
            "/css/home.css"
        ]
    });
    }
  }

  // ✅ Nếu là admin
  if (role === 'Admin') {
    if (baseUrl.startsWith('/nha-cung-cap')) {
      return res.redirect('/home', {
        js: [
          "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.js",
          "/js/home/timkiem.js"
        ],
        css: [
            "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.css",
            "/css/home.css"
        ]
    });
    }
  }

  // Nếu hợp lệ → cho qua
  next();
};