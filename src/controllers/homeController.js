const Phong = require('../models/phong');
exports.getHomePage = async (req, res) => {
    try {
      const topRooms = await Phong.getTopBookedRooms();
      res.render('home', { 
        title: 'Trang chủ',
        topRooms
      });
    } catch (error) {
      console.error("Lỗi tải trang chủ:", error);
      res.status(500).send("Lỗi tải trang chủ");
    }
  };