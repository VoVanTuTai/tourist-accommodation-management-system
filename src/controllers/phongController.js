const Phong = require("../models/phong"); // Model phòng
const LoaiPhong = require("../models/loaiPhong"); // Model loại phòng
const fs = require("fs");
const path = require("path"); // ✅ thêm dòng này

// -------------------------
// HIỂN THỊ DANH SÁCH PHÒNG
// -------------------------
exports.renderPhongList = (req, res) => {
  const maNCC = 1; // giả định NCC đang đăng nhập
  Phong.getPhongByNCC(maNCC, (err, data) => {
    if (err) return res.status(500).send("Lỗi khi tải danh sách phòng");
    res.render("phong/danhsachphong", { rooms: data });
  });
};

// -------------------------
// HIỂN THỊ FORM THÊM PHÒNG
// -------------------------
// Hiển thị form thêm phòng (có danh sách loại phòng)
exports.renderAddPhong = (req, res) => {
  LoaiPhong.getAll((err, loaiPhongs) => {
    if (err) {
      console.error("Lỗi khi tải loại phòng:", err);
      return res.status(500).send("Lỗi khi tải danh sách loại phòng");
    }

    // ✅ Truyền danh sách loại phòng sang view
    res.render("phong/themphong", { loaiPhongs });
  });
};

// -------------------------
// XỬ LÝ THÊM PHÒNG
// -------------------------
exports.handleAddPhong = (req, res) => {
  // Nếu có file upload, lấy tên file, còn không thì dùng giá trị rỗng
  const imageName = req.file ? req.file.filename : "";

  const data = {
    TenPhong: req.body.TenPhong,
    MaLoai: req.body.MaLoai,
    Gia: req.body.Gia,
    SucChua: req.body.SucChua,
    TinhTrang: req.body.TinhTrang,
    HinhAnh: imageName,  // ✅ lưu tên file ảnh
    MaNhaCungCap: 1      // giả định NCC = 1
  };

  Phong.addPhong(data, (err) => {
    if (err) {
      console.error("Lỗi thêm phòng:", err);
      return res.status(500).send("Lỗi thêm phòng");
    }
    res.redirect("/phong");
  });
};


// -------------------------
// HIỂN THỊ FORM SỬA PHÒNG
// -------------------------
exports.renderEditPhong = (req, res) => {
  const { id } = req.params;

  // Lấy thông tin phòng cần sửa
  Phong.getPhongById(id, (err, phongResult) => {
    if (err || phongResult.length === 0)
      return res.status(404).send("Không tìm thấy phòng");

    const phong = phongResult[0];

    // ✅ Lấy danh sách loại phòng để hiển thị trong dropdown
    LoaiPhong.getAll((err, loaiPhongs) => {
      if (err) {
        console.error("Lỗi khi tải loại phòng:", err);
        return res.status(500).send("Lỗi khi tải danh sách loại phòng");
      }

      // ✅ Truyền cả 'phong' và 'loaiPhongs' sang view
      res.render("phong/suaphong", { phong, loaiPhongs });
    });
  });
};
// -------------------------
// XỬ LÝ CẬP NHẬT PHÒNG
// -------------------------
// -----------------------------------------
// Xử lý cập nhật phòng (có thể thay ảnh mới)
// -----------------------------------------
exports.handleEditPhong = (req, res) => {
  const data = req.body;
  const newImage = req.file ? req.file.filename : null; // ảnh mới nếu có

  // Lấy thông tin phòng cũ để biết ảnh cũ
  Phong.getPhongById(data.MaPhong, (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).send("Không tìm thấy phòng để cập nhật");
    }

    const oldPhong = result[0];
    const oldImage = oldPhong.HinhAnh;

    // Nếu có ảnh mới → cập nhật ảnh và xóa ảnh cũ
    if (newImage) {
      // Xóa ảnh cũ trong thư mục (nếu có)
      if (oldImage) {
        const oldPath = path.join(__dirname, "../public/images", oldImage);
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("Không thể xóa ảnh cũ:", err.message);
        });
      }

      // Cập nhật ảnh mới
      data.HinhAnh = newImage;
    } else {
      // Giữ nguyên ảnh cũ nếu không upload ảnh mới
      data.HinhAnh = oldImage;
    }

    // Gọi model để cập nhật
    Phong.updatePhong(data, (err) => {
      if (err) {
        console.error("Lỗi SQL khi cập nhật phòng:", err);
        return res.status(500).send("Lỗi cập nhật phòng");
      }
      res.redirect("/phong");
    });
  });
};

// -------------------------
// HIỂN THỊ FORM CẬP NHẬT TRẠNG THÁI
// -------------------------
exports.renderUpdateStatus = (req, res) => {
  const { id } = req.params;
  Phong.getPhongById(id, (err, result) => {
    if (err || result.length === 0)
      return res.status(404).send("Không tìm thấy phòng");
    res.render("phong/capnhatTrangThaiPhong", { phong: result[0] });
  });
};

// -------------------------
// XỬ LÝ CẬP NHẬT TRẠNG THÁI
// -------------------------
exports.handleUpdateStatus = (req, res) => {
  const { MaPhong, TinhTrang } = req.body;

  if (!MaPhong || !TinhTrang) {
    console.log("Thiếu dữ liệu:", req.body);
    return res.status(400).send("Thiếu thông tin phòng hoặc trạng thái!");
  }

  Phong.updateTrangThaiPhong(MaPhong, TinhTrang, (err) => {
    if (err) {
      console.error("Lỗi SQL:", err);
      return res.status(500).send("Lỗi khi thay đổi trạng thái phòng!");
    }
    res.redirect("/phong");
  });
};
