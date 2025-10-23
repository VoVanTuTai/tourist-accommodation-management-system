const path = require("path");
const fs = require("fs");
const db = require("../../config/db");
const Phong = require("../models/phong");
const DiaChi = require("../models/DiaChi");
const LoaiPhong = require("../models/loaiPhong");

// 📌 [GET] Danh sách phòng của NCC
exports.renderDanhSachPhong = async (req, res) => {
  try {
    const ncc = req.session.ncc; // giả lập trong server.js
    if (!ncc) return res.status(401).send("Vui lòng đăng nhập");

    const rooms = await Phong.getPhongByNCC(ncc.MaNCC);
    res.render("nhacungcap/phong/danhsach", { rooms, ncc });
  } catch (err) {
    console.error("❌ Lỗi renderDanhSachPhong:", err);
    res.status(500).send("Lỗi khi tải danh sách phòng");
  }
};

// 📌 [GET] Form thêm phòng
exports.renderThemPhong = async (req, res) => {
  try {
    const loaiPhongs = await LoaiPhong.getAll();
    res.render("nhacungcap/phong/themphong", { loaiPhongs });
  } catch (err) {
    console.error("❌ Lỗi renderThemPhong:", err);
    res.status(500).send("Lỗi khi tải form thêm phòng");
  }
};

// 📌 [POST] Xử lý thêm phòng
exports.handleThemPhong = async (req, res) => {
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
      MaNhaCungCap: req.session.ncc
    };

    await Phong.addPhong(data);
    res.redirect("/phong");
  } catch (err) {
    console.error("❌ Lỗi thêm phòng:", err);
    res.status(500).send("Lỗi khi thêm phòng mới");
  }
};

// [GET] Form sửa phòng
// [GET] Form sửa phòng
exports.renderSuaPhong = async (req, res) => {
  try {
    const id = req.params.id;
    const phong = await Phong.getPhongById(id);
    if (!phong) return res.status(404).send("Không tìm thấy phòng");

    const loaiPhongs = await LoaiPhong.getAll();

    // 🧭 Lấy thông tin địa chỉ hiện tại của phòng (nếu có)
    const diaChiHienTai = phong.MaDiaChi ? await DiaChi.getById(phong.MaDiaChi) : null;

    // 🧭 Lấy danh sách tỉnh và xã (để hiển thị select)
    const [tinhs] = await db.execute("SELECT * FROM Tinh");
    const [xas] = await db.execute("SELECT * FROM Xa");

    // ✅ Gửi dữ liệu chính xác sang view
    res.render("nhacungcap/phong/suaphong", { phong, loaiPhongs, diaChiHienTai, tinhs, xas });
  } catch (err) {
    console.error("❌ Lỗi renderSuaPhong:", err);
    res.status(500).send("Lỗi khi tải form sửa phòng");
  }
};

// [POST] Xử lý cập nhật phòng
exports.handleSuaPhong = async (req, res) => {
  try {
    const {
      MaPhong, TenPhong, MaLoai, Gia, SucChua, TinhTrang,
      MaTinh, MaXa, ChiTietDiaChi
    } = req.body;

    const newImage = req.file ? req.file.filename : null;

    const oldPhong = await Phong.getPhongById(MaPhong);
    if (!oldPhong) return res.status(404).send("Không tìm thấy phòng");

    // 🖼️ Xử lý ảnh
    let finalImage = oldPhong.HinhAnh;
    if (newImage) {
      if (oldPhong.HinhAnh) {
        const oldPath = path.join(__dirname, "../public/images", oldPhong.HinhAnh);
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("⚠️ Không thể xóa ảnh cũ:", err.message);
        });
      }
      finalImage = newImage;
    }

    // 🧭 Xử lý địa chỉ
    let finalMaDiaChi = oldPhong.MaDiaChi;
    if (oldPhong.MaDiaChi) {
      // Cập nhật địa chỉ cũ
      await DiaChi.update({
        MaDiaChi: oldPhong.MaDiaChi,
        ChiTiet: ChiTietDiaChi,
        MaXa
      });
    } else {
      // Tạo địa chỉ mới nếu chưa có
      const newId = await DiaChi.create({
        ChiTiet: ChiTietDiaChi,
        MaXa,
        MaNhaCungCap: oldPhong.MaNhaCungCap
      });
      finalMaDiaChi = newId;
    }

    // 🧩 Cập nhật phòng
    const updatedData = {
      MaPhong,
      TenPhong,
      MaLoai,
      Gia,
      SucChua,
      TinhTrang,
      MaDiaChi: finalMaDiaChi,
      HinhAnh: finalImage
    };

    await Phong.updatePhong(updatedData);
    res.redirect("/nhacungcap/phong");
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

    res.render("nhacungcap/phong/capnhattrangthai", { phong });
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
    res.redirect("/nhacungcap/phong");
  } catch (err) {
    console.error("❌ Lỗi handleCapNhatTrangThai:", err);
    res.status(500).send("Lỗi khi cập nhật trạng thái phòng");
  }
};
