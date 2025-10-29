const Phong = require('../models/phong');
exports.getHomePage = async (req, res) => {
    try {
      const topRooms = await Phong.getTopBookedRooms();
      res.render('home', { 
        layout: 'layout',
        title: 'Trang chủ',
        topRooms,
        js: process.env.HOME_SCRIPTS,
        css: process.env.HOME_STYLES
      });
    } catch (error) {
      console.error("Lỗi tải trang chủ:", error);
      res.status(500).send("Lỗi tải trang chủ");
    }
  };
  