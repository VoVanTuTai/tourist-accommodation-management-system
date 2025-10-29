const Phong = require("../models/phong");
const LoaiPhong = require("../models/loaiPhong");
const fs = require("fs");
const DiaChi = require("../models/DiaChi");
const db = require("../../config/db");
const path = require("path");

/* =====================================================
   ✅ 1. HIỂN THỊ DANH SÁCH PHÒNG CỦA NHÀ CUNG CẤP
===================================================== */
exports.renderDanhSachPhongCuaNhaCungCap = async (req, res) => {
  try {
    const ncc = req.session.ncc; // Lấy thông tin NCC đăng nhập
    if (!ncc) return res.status(401).send("Vui lòng đăng nhập");

    const filter = req.query.filter || "all"; // Lấy filter từ query (nếu có)
    const rooms = await Phong.getPhongByNCC(ncc.MaNCC);

    // Lọc theo trạng thái
    let filteredRooms = rooms;
    if (filter !== "all") {
      const filterValue = parseInt(filter); // vì TinhTrang là số
      filteredRooms = rooms.filter(p => p.TinhTrang === filterValue);
    }

    res.render("nhacungcap/phong/danhsach", {
      rooms: filteredRooms,
      currentFilter: filter,
      ncc
    });
  } catch (err) {
    console.error("❌ Lỗi renderDanhSachPhongCuaNhaCungCap:", err);
    res.status(500).send("Lỗi khi tải danh sách phòng");
  }
};

/* =====================================================
   ✅ 2. HIỂN THỊ CHI TIẾT PHÒNG
===================================================== */
exports.renderChiTietPhong = async (req, res) => {
  try {
    const { id } = req.params;
    const phong = await Phong.getPhongById(id);

    if (!phong) {
      return res.status(404).send("Không tìm thấy phòng");
    }

    res.render("nhacungcap/phong/chitietphong", { phong });
  } catch (err) {
    console.error("❌ Lỗi khi tải chi tiết phòng:", err);
    res.status(500).send("Lỗi khi tải chi tiết phòng");
  }
};

/* =====================================================
   ✅ 3. HIỂN THỊ DANH SÁCH PHÒNG CHO KHÁCH HÀNG
===================================================== */
exports.renderPhongList = async (req, res) => {
  try {
    const phongList = await Phong.getAllPhong();
    res.render("khachhang/danhsachphong", {
      phongList,
      message: null,
      query: {}
    });
  } catch (err) {
    console.error("❌ Lỗi renderPhongList:", err);
    res.render("khachhang/danhsachphong", {
      phongList: [],
      message: "Lỗi tải danh sách phòng.",
      query: {}
    });
  }
};

/* =====================================================
   ✅ 4. HIỂN THỊ FORM THÊM PHÒNG
===================================================== */
exports.renderThemPhong = async (req, res) => {
  try {
    const ncc = req.session.ncc;
    if (!ncc) return res.status(401).send("Vui lòng đăng nhập");

    const loaiPhongs = await LoaiPhong.getAll();
    const [tinhs] = await db.execute("SELECT * FROM Tinh");
    const [xas] = await db.execute("SELECT * FROM Xa");

    res.render("nhacungcap/phong/themphong", { loaiPhongs, tinhs, xas, ncc });
  } catch (err) {
    console.error("❌ Lỗi renderThemPhong:", err);
    res.status(500).send("Lỗi khi tải form thêm phòng");
  }
};

/* =====================================================
   ✅ 5. XỬ LÝ THÊM PHÒNG
===================================================== */
exports.handleThemPhong = async (req, res) => {
  try {
    const ncc = req.session.ncc;
    if (!ncc) return res.status(401).send("⚠️ Vui lòng đăng nhập trước khi thêm phòng.");

    const { TenPhong, MaLoai, Gia, SucChua, MaXa, ChiTietDiaChi, MoTa } = req.body;
    const image = req.file ? req.file.filename : null;

    console.log("📋 Dữ liệu nhận từ form:", req.body);

    if (!TenPhong || !MaLoai || !Gia || !SucChua || !MaXa || !ChiTietDiaChi) {
      console.error("⚠️ Thiếu dữ liệu bắt buộc:", { TenPhong, MaLoai, Gia, SucChua, MaXa, ChiTietDiaChi });
      return res.status(400).send("Vui lòng nhập đầy đủ thông tin phòng!");
    }

    const newMaDiaChi = await DiaChi.create({ ChiTiet: ChiTietDiaChi, MaXa });

    if (!newMaDiaChi) {
      console.error("❌ Không thể tạo địa chỉ:", { ChiTietDiaChi, MaXa });
      return res.status(500).send("Không thể tạo địa chỉ mới cho phòng.");
    }

    const data = {
      TenPhong,
      MaLoai,
      MoTa: MoTa || null,
      Gia,
      SucChua,
      TinhTrang: 1,
      HinhAnh: image ?? null,
      MaDiaChi: newMaDiaChi,
      MaNhaCungCap: ncc.MaNCC ?? null
    };

    console.log("📦 Chuẩn bị thêm phòng:", data);

    await Phong.addPhong(data);
    console.log("✅ Thêm phòng thành công!");
    res.redirect("/nhacungcap/phong");
  } catch (err) {
    console.error("❌ Lỗi handleThemPhong:", err);
    res.status(500).send("Lỗi khi thêm phòng mới");
  }
};

/* =====================================================
   ✅ 6. HIỂN THỊ FORM SỬA PHÒNG
===================================================== */
exports.renderSuaPhong = async (req, res) => {
  try {
    const id = req.params.id;
    const phong = await Phong.getPhongById(id);
    if (!phong) return res.status(404).send("Không tìm thấy phòng");

    const loaiPhongs = await LoaiPhong.getAll();
    const diaChiHienTai = phong.MaDiaChi ? await DiaChi.getById(phong.MaDiaChi) : null;
    const [tinhs] = await db.execute("SELECT * FROM Tinh");
    const [xas] = await db.execute("SELECT * FROM Xa");

    res.render("nhacungcap/phong/suaphong", { phong, loaiPhongs, diaChiHienTai, tinhs, xas });
  } catch (err) {
    console.error("❌ Lỗi renderSuaPhong:", err);
    res.status(500).send("Lỗi khi tải form sửa phòng");
  }
};

/* =====================================================
   ✅ 7. XỬ LÝ CẬP NHẬT PHÒNG
===================================================== */
exports.handleSuaPhong = async (req, res) => {
  try {
    const {
      MaPhong, TenPhong, MaLoai, Gia, SucChua, TinhTrang,
      MaTinh, MaXa, ChiTietDiaChi
    } = req.body;

    const newImage = req.file ? req.file.filename : null;
    const oldPhong = await Phong.getPhongById(MaPhong);
    if (!oldPhong) return res.status(404).send("Không tìm thấy phòng");

    // 🖼️ Ảnh
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

    // 🧭 Địa chỉ
    let finalMaDiaChi = oldPhong.MaDiaChi;
    if (oldPhong.MaDiaChi) {
      await DiaChi.update({
        MaDiaChi: oldPhong.MaDiaChi,
        ChiTiet: ChiTietDiaChi,
        MaXa
      });
    } else {
      const newId = await DiaChi.create({
        ChiTiet: ChiTietDiaChi,
        MaXa,
        MaNhaCungCap: oldPhong.MaNhaCungCap
      });
      finalMaDiaChi = newId;
    }

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

/* =====================================================
   ✅ 8. HIỂN THỊ FORM CẬP NHẬT TRẠNG THÁI PHÒNG
===================================================== */
exports.renderUpdateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const phong = await Phong.getPhongById(id);
    if (!phong) return res.status(404).send("Không tìm thấy phòng");

    res.render("nhacungcap/phong/capnhatTrangThaiPhong", { phong });
  } catch (err) {
    console.error("❌ Lỗi khi tải form cập nhật trạng thái:", err);
    res.status(500).send("Lỗi khi tải form cập nhật trạng thái phòng");
  }
};

/* =====================================================
   ✅ 9. XỬ LÝ CẬP NHẬT TRẠNG THÁI PHÒNG
===================================================== */
exports.handleUpdateStatus = async (req, res) => {
  try {
    const { MaPhong, TinhTrang } = req.body;

    if (!MaPhong || TinhTrang === undefined) {
      console.warn("⚠️ Thiếu dữ liệu cập nhật trạng thái:", req.body);
      return res.status(400).send("Thiếu thông tin phòng hoặc trạng thái!");
    }

    await Phong.updateTrangThaiPhong(MaPhong, TinhTrang);
    res.redirect("/nhacungcap/phong");
  } catch (err) {
    console.error("❌ Lỗi khi thay đổi trạng thái phòng:", err);
    res.status(500).send("Lỗi khi thay đổi trạng thái phòng!");
  }
};
