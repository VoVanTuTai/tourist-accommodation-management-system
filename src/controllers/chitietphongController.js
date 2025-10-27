const Phong = require("../models/chitietphong");

exports.xemChiTietPhong = async (req, res) => {
  try {
    const maPhong = req.params.maPhong;
    const phong = await Phong.getPhongById(maPhong);

    if (!phong) {
      return res.render("phong/chitiet", { error: "Không tìm thấy phòng", phong: null });
    }

    res.render("phong/chitiet", {
      phong,
      error: null,
    });
  } catch (err) {
    console.error("❌ Lỗi xemChiTietPhong:", err);
    res.render("phong/chitiet", { error: "Có lỗi xảy ra khi tải dữ liệu", phong: null });
  }
};
