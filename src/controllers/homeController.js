const Phong = require('../models/phong');

exports.getHomePage = async (req, res) => {
    try {
      const topRooms = await Phong.getTopBookedRooms();
      res.render('home', { 
        layout: 'layout',
        title: 'Trang chủ',
        topRooms,
        js: [
          "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.js",
          "/js/home/timkiem.js"
        ],
        css: [
            "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.css",
            "/css/home.css"
        ]
      });
    } catch (error) {
      console.error("Lỗi tải trang chủ:", error);
      res.status(500).send("Lỗi tải trang chủ");
    }
  };
  