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
    console.log("📘 NCC trong session:", req.session.user);

    const ncc = req.session.user; // Lấy thông tin NCC đăng nhập
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
      query: {},
      js: [
        "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.js",
        "/js/home/timkiem.js"
      ],
      css: [
          "https://cdn.jsdelivr.net/npm/nouislider@15.7.0/dist/nouislider.min.css",
          "/css/home.css"
      ]
    });
  } catch (err) {
    console.error("❌ Lỗi renderPhongList:", err);
    res.render("khachhang/danhsachphong", {
      phongList: [],
      message: "Lỗi tải danh sách phòng.",
      query: {},
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
};

/* =====================================================
   ✅ 4. HIỂN THỊ FORM THÊM PHÒNG
===================================================== */
exports.renderThemPhong = async (req, res) => {
  try {
    const ncc = req.session.user;
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
    const ncc = req.session.user;
    if (!ncc) return res.status(401).send("⚠️ Vui lòng đăng nhập trước khi thêm phòng.");

    const { TenPhong, MaLoai, Gia, SucChua, MaXa, ChiTietDiaChi, MoTa } = req.body;
    const images = req.files ? req.files.map(f => f.filename) : []; // 🔹 Nhiều ảnh

    // 🧩 KIỂM TRA DỮ LIỆU NHẬP
    const errors = [];

    if (!TenPhong || TenPhong.trim().length < 3)
      errors.push("Tên phòng phải có ít nhất 3 ký tự.");

    if (!MaLoai)
      errors.push("Vui lòng chọn loại phòng.");

    if (!Gia || isNaN(Gia) || Gia < 100000)
      errors.push("Giá phòng phải là số lớn hơn 100.000 VND.");

    if (!SucChua || isNaN(SucChua) || SucChua < 1)
      errors.push("Sức chứa phải là số nguyên dương.");

    if (!MaXa)
      errors.push("Vui lòng chọn xã.");

    if (!ChiTietDiaChi || ChiTietDiaChi.trim().length < 5)
      errors.push("Chi tiết địa chỉ phải có ít nhất 5 ký tự.");

    if (images.length === 0)
      errors.push("Vui lòng tải lên ít nhất một hình ảnh.");

    if (errors.length > 0) {
      console.warn("⚠️ Lỗi nhập liệu:", errors);
      const loaiPhongs = await LoaiPhong.getAll();
      const [tinhs] = await db.execute("SELECT * FROM Tinh");
      const [xas] = await db.execute("SELECT * FROM Xa");
      return res.render("nhacungcap/phong/themphong", {
        loaiPhongs,
        tinhs,
        xas,
        ncc,
        message: errors.join("<br>")
      });
    }

    // 🏠 Nếu dữ liệu hợp lệ → tạo địa chỉ
    const newMaDiaChi = await DiaChi.create({ ChiTiet: ChiTietDiaChi, MaXa });

    // 🏡 Chuẩn bị dữ liệu thêm phòng
    const data = {
      TenPhong,
      MaLoai,
      MoTa: MoTa || null,
      Gia,
      SucChua,
      TinhTrang: 1,
      HinhAnh: JSON.stringify(images), // 🔹 Lưu JSON ["img1.jpg", "img2.jpg"]
      MaDiaChi: newMaDiaChi,
      MaNhaCungCap: ncc.MaNCC ?? null
    };

    await Phong.addPhong(data);
    console.log("Thêm phòng thành công!");
    res.redirect("/nhacungcap/phong");
  } catch (err) {
    console.error("Lỗi handleThemPhong:", err);
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
    const ncc = req.session.user;
    if (!ncc) return res.status(401).send("⚠️ Vui lòng đăng nhập trước khi sửa phòng.");

    const {
      MaPhong,
      TenPhong,
      MaLoai,
      Gia,
      SucChua,
      TinhTrang,
      MaXa,
      ChiTietDiaChi,
      MoTa,
    } = req.body;

    const newImages = req.files ? req.files.map(f => f.filename) : []; // ⬅️ nhiều ảnh mới

    // 🧩 Kiểm tra dữ liệu
    const errors = [];

    if (!TenPhong || TenPhong.trim().length < 3)
      errors.push("Tên phòng phải có ít nhất 3 ký tự.");

    if (!MaLoai) errors.push("Vui lòng chọn loại phòng.");

    if (!Gia || isNaN(Gia) || Gia < 100000)
      errors.push("Giá phòng phải là số lớn hơn 100.000 VND.");

    if (!SucChua || isNaN(SucChua) || SucChua < 1)
      errors.push("Sức chứa phải là số nguyên dương.");

    const tinhTrangInt = parseInt(TinhTrang);
    if (![0, 1, 2].includes(tinhTrangInt))
      errors.push("Tình trạng không hợp lệ (0: Đã đặt, 1: Còn trống, 2: Bảo trì).");

    if (!MaXa) errors.push("Vui lòng chọn xã.");

    if (!ChiTietDiaChi || ChiTietDiaChi.trim().length < 5)
      errors.push("Chi tiết địa chỉ phải có ít nhất 5 ký tự.");

    // Lấy dữ liệu cũ
    const phong = await Phong.getPhongById(MaPhong);
    const loaiPhongs = await LoaiPhong.getAll();
    const diaChiHienTai = phong?.MaDiaChi ? await DiaChi.getById(phong.MaDiaChi) : null;
    const [tinhs] = await db.execute("SELECT * FROM Tinh");
    const [xas] = await db.execute("SELECT * FROM Xa");

    if (errors.length > 0) {
      return res.render("nhacungcap/phong/suaphong", {
        phong,
        loaiPhongs,
        diaChiHienTai,
        tinhs,
        xas,
        ncc,
        message: errors.join("<br>"),
      });
    }

    // 🖼️ Ảnh
    let finalImages = [];
    if (phong.HinhAnh) {
      try {
        // Parse JSON nếu có
        if (phong.HinhAnh.trim().startsWith("[")) {
          finalImages = JSON.parse(phong.HinhAnh);
        } else {
          finalImages = [phong.HinhAnh];
        }
      } catch (err) {
        finalImages = [phong.HinhAnh];
      }
    }

    // Nếu upload ảnh mới → ghi đè toàn bộ (có thể tùy chỉnh thành “ghép thêm”)
    if (newImages.length > 0) {
      // Xoá ảnh cũ trên server
      finalImages.forEach(img => {
        const oldPath = path.join(__dirname, "../public/images", img);
        fs.unlink(oldPath, err => {
          if (err) console.warn("⚠️ Không thể xóa ảnh cũ:", err.message);
        });
      });

      finalImages = newImages; // ghi đè toàn bộ
    }

    // 📍 Cập nhật địa chỉ
    let finalMaDiaChi = phong.MaDiaChi;
    if (finalMaDiaChi) {
      await DiaChi.update({
        MaDiaChi: finalMaDiaChi,
        ChiTiet: ChiTietDiaChi,
        MaXa,
      });
    } else {
      finalMaDiaChi = await DiaChi.create({
        ChiTiet: ChiTietDiaChi,
        MaXa,
      });
    }

    // 💾 Dữ liệu cập nhật
    const updatedData = {
      MaPhong,
      TenPhong: TenPhong.trim(),
      MaLoai,
      Gia,
      SucChua,
      MoTa: MoTa || null,
      TinhTrang: tinhTrangInt,
      HinhAnh: JSON.stringify(finalImages), // ✅ lưu mảng JSON
      MaDiaChi: finalMaDiaChi,
    };

    await Phong.updatePhong(updatedData);

    console.log("✅ Cập nhật phòng thành công!");
    res.redirect("/nhacungcap/phong");
  } catch (err) {
    console.error("❌ Lỗi handleSuaPhong:", err);
    res.status(500).send("Lỗi khi cập nhật phòng.");
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
