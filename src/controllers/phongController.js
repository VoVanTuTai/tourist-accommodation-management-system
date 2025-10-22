const Phong = require("../models/phong"); // Model phòng
const LoaiPhong = require("../models/loaiPhong"); // Model loại phòng
const fs = require("fs");
const path = require("path");

// -------------------------
// HIỂN THỊ DANH SÁCH PHÒNG
// -------------------------
exports.renderPhongList = async (req, res) => {
  try {
    const maNCC = 1; // NCC đăng nhập giả định
    const rooms = await Phong.getPhongByNCC(maNCC);
    res.render("phong/danhsachphong", { rooms });
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách phòng:", err);
    res.status(500).send("Lỗi khi tải danh sách phòng");
  }
};

// -------------------------
// HIỂN THỊ FORM THÊM PHÒNG
// -------------------------
exports.renderAddPhong = async (req, res) => {
  try {
    const loaiPhongs = await LoaiPhong.getAll();
    res.render("phong/themphong", { loaiPhongs });
  } catch (err) {
    console.error("❌ Lỗi khi tải loại phòng:", err);
    res.status(500).send("Lỗi khi tải danh sách loại phòng");
  }
};

// -------------------------
// XỬ LÝ THÊM PHÒNG
// -------------------------
exports.handleAddPhong = async (req, res) => {
  try {
    const imageName = req.file ? req.file.filename : "";

    const data = {
      TenPhong: req.body.TenPhong,
      MaLoai: req.body.MaLoai,
      Gia: req.body.Gia,
      SucChua: req.body.SucChua,
      TinhTrang: req.body.TinhTrang,
      HinhAnh: imageName,
      MaDiaChi: req.body.MaDiaChi,
      MaNhaCungCap: 1, // NCC giả định
    };

    await Phong.addPhong(data);
    res.redirect("/phong");
  } catch (err) {
    console.error("❌ Lỗi thêm phòng:", err);
    res.status(500).send("Lỗi khi thêm phòng mới");
  }
};

// -------------------------
// HIỂN THỊ FORM SỬA PHÒNG
// -------------------------
exports.renderEditPhong = async (req, res) => {
  try {
    const { id } = req.params;
    const phongResult = await Phong.getPhongById(id);

    if (!phongResult || phongResult.length === 0)
      return res.status(404).send("Không tìm thấy phòng");

    const phong = phongResult[0];
    const loaiPhongs = await LoaiPhong.getAll();

    res.render("phong/suaphong", { phong, loaiPhongs });
  } catch (err) {
    console.error("❌ Lỗi khi tải dữ liệu sửa phòng:", err);
    res.status(500).send("Lỗi khi tải dữ liệu sửa phòng");
  }
};

// -------------------------
// XỬ LÝ CẬP NHẬT PHÒNG
// -------------------------
exports.handleEditPhong = async (req, res) => {
  try {
    const data = req.body;
    const newImage = req.file ? req.file.filename : null;

    // Lấy thông tin phòng cũ
    const result = await Phong.getPhongById(data.MaPhong);
    if (!result || result.length === 0) {
      return res.status(404).send("Không tìm thấy phòng để cập nhật");
    }

    const oldPhong = result[0];
    const oldImage = oldPhong.HinhAnh;

    // Nếu có ảnh mới thì cập nhật và xóa ảnh cũ
    if (newImage) {
      if (oldImage) {
        const oldPath = path.join(__dirname, "../public/images", oldImage);
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("⚠️ Không thể xóa ảnh cũ:", err.message);
        });
      }
      data.HinhAnh = newImage;
    } else {
      data.HinhAnh = oldImage; // Giữ ảnh cũ
    }

    await Phong.updatePhong(data);
    res.redirect("/phong");
  } catch (err) {
    console.error("❌ Lỗi SQL khi cập nhật phòng:", err);
    res.status(500).send("Lỗi cập nhật phòng");
  }
};

// -------------------------
// HIỂN THỊ FORM CẬP NHẬT TRẠNG THÁI
// -------------------------
exports.renderUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Phong.getPhongById(id);
    if (!result || result.length === 0)
      return res.status(404).send("Không tìm thấy phòng");

    res.render("phong/capnhatTrangThaiPhong", { phong: result[0] });
  } catch (err) {
    console.error("❌ Lỗi khi tải form cập nhật trạng thái:", err);
    res.status(500).send("Lỗi khi tải form cập nhật trạng thái phòng");
  }
};

// -------------------------
// XỬ LÝ CẬP NHẬT TRẠNG THÁI
// -------------------------
exports.handleUpdateStatus = async (req, res) => {
  try {
    const { MaPhong, TinhTrang } = req.body;

    if (!MaPhong || TinhTrang === undefined) {
      console.warn("⚠️ Thiếu dữ liệu:", req.body);
      return res.status(400).send("Thiếu thông tin phòng hoặc trạng thái!");
    }

    await Phong.updateTrangThaiPhong(MaPhong, TinhTrang);
    res.redirect("/phong");
  } catch (err) {
    console.error("❌ Lỗi khi thay đổi trạng thái phòng:", err);
    res.status(500).send("Lỗi khi thay đổi trạng thái phòng!");
  }
};
