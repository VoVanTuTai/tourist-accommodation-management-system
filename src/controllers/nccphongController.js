const path = require("path");
const fs = require("fs");
const Phong = require("../models/phong");
const LoaiPhong = require("../models/loaiPhong");

// 📌 [GET] Danh sách phòng của NCC
exports.renderDanhSachPhong = async (req, res) => {
  try {
    const ncc = req.session.ncc; // giả lập trong server.js
    if (!ncc) return res.status(401).send("Vui lòng đăng nhập");

    const rooms = await Phong.getPhongByNCC(ncc.MaNCC);
    res.render("ncc/phong/danhsach", { rooms, ncc });
  } catch (err) {
    console.error("❌ Lỗi renderDanhSachPhong:", err);
    res.status(500).send("Lỗi khi tải danh sách phòng");
  }
};

// 📌 [GET] Form thêm phòng
exports.renderThemPhong = async (req, res) => {
  try {
    const loaiPhongs = await LoaiPhong.getAll();
    res.render("ncc/phong/themphong", { loaiPhongs });
  } catch (err) {
    console.error("❌ Lỗi renderThemPhong:", err);
    res.status(500).send("Lỗi khi tải form thêm phòng");
  }
};

// 📌 [POST] Xử lý thêm phòng
exports.handleThemPhong = async (req, res) => {
  try {
    const ncc = req.session.ncc;
    const { TenPhong, MaLoai, Gia, SucChua, TinhTrang } = req.body;
    const HinhAnh = req.file ? req.file.filename : null;

    const data = { TenPhong, MaLoai, Gia, SucChua, TinhTrang, HinhAnh, MaNhaCungCap: ncc.MaNCC };

    await Phong.addPhong(data);
    res.redirect("/ncc/phong");
  } catch (err) {
    console.error("❌ Lỗi handleThemPhong:", err);
    res.status(500).send("Lỗi khi thêm phòng");
  }
};


// 📌 [GET] Form sửa phòng
exports.renderSuaPhong = async (req, res) => {
  try {
    const id = req.params.id;
    const phong = await Phong.getPhongById(id);

    if (!phong) return res.status(404).send("Không tìm thấy phòng");

    // 🧩 Lấy danh sách loại phòng
    const loaiPhongs = await LoaiPhong.getAll();

    console.log("🧠 LoaiPhong trả về:", loaiPhongs); // debug nhanh

    // 🧩 Gửi đầy đủ dữ liệu sang EJS
    res.render("ncc/phong/suaphong", { phong, loaiPhongs });
  } catch (err) {
    console.error("❌ Lỗi renderSuaPhong:", err);
    res.status(500).send("Lỗi khi tải form sửa phòng");
  }
};
// 📌 [POST] Xử lý cập nhật phòng
exports.handleSuaPhong = async (req, res) => {
  try {
    const { MaPhong, TenPhong, MaLoai, Gia, SucChua, TinhTrang } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const oldPhong = await Phong.getPhongById(MaPhong);
    if (!oldPhong) return res.status(404).send("Không tìm thấy phòng");

    let finalImage = oldPhong.HinhAnh;
    if (newImage) {
      // Xóa ảnh cũ nếu có
      if (oldPhong.HinhAnh) {
        const oldPath = path.join(__dirname, "../public/images", oldPhong.HinhAnh);
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("⚠️ Không thể xóa ảnh cũ:", err.message);
        });
      }
      finalImage = newImage;
    }

    const updatedData = { MaPhong, TenPhong, MaLoai, Gia, SucChua, TinhTrang, HinhAnh: finalImage };
    await Phong.updatePhong(updatedData);

    res.redirect("/ncc/phong");
  } catch (err) {
    console.error("❌ Lỗi handleSuaPhong:", err);
    res.status(500).send("Lỗi khi cập nhật phòng");
  }
};

// 📌 [GET] Form cập nhật trạng thái
exports.renderCapNhatTrangThai = async (req, res) => {
  try {
    const id = req.params.id;
    const phong = await Phong.getPhongById(id);
    if (!phong) return res.status(404).send("Không tìm thấy phòng");

    res.render("ncc/phong/capnhattrangthai", { phong });
  } catch (err) {
    console.error("❌ Lỗi renderCapNhatTrangThai:", err);
    res.status(500).send("Lỗi khi tải form cập nhật trạng thái");
  }
};

// 📌 [POST] Xử lý cập nhật trạng thái
exports.handleCapNhatTrangThai = async (req, res) => {
  try {
    const { MaPhong, TinhTrang } = req.body;
    await Phong.updateTrangThaiPhong(MaPhong, TinhTrang);
    res.redirect("/ncc/phong");
  } catch (err) {
    console.error("❌ Lỗi handleCapNhatTrangThai:", err);
    res.status(500).send("Lỗi khi cập nhật trạng thái phòng");
  }
};
