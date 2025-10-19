const Phong = require("../models/phong");

exports.renderPhongList = (req, res) => {
  const maNCC = 1; // Tạm thời nhà cung cấp cố định
  Phong.getPhongByNCC(maNCC, (err, data) => {
    if (err) return res.status(500).send("Lỗi khi tải danh sách phòng");
    res.render("phong/danhsachphong", { rooms: data });
  });
};

exports.renderAddPhong = (req, res) => {
  res.render("phong/add");
};

exports.handleAddPhong = (req, res) => {
  const data = {
    TenPhong: req.body.TenPhong,
    MaLoai: req.body.MaLoai,
    Gia: req.body.Gia,
    SucChua: req.body.SucChua,
    TinhTrang: req.body.TinhTrang,
    HinhAnh: req.body.HinhAnh,
    MaNhaCungCap: 1 // giả định NCC=1
  };

  Phong.addPhong(data, (err) => {
    if (err) return res.status(500).send("Lỗi thêm phòng");
    res.redirect("/phong");
  });
};
