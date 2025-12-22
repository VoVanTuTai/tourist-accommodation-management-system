const Phong = require("../models/chitietphong");
// Giữ nguyên việc import db trực tiếp
const db = require('../../config/db'); 

exports.xemChiTietPhong = async (req, res) => {
  try {
    const maPhong = req.params.maPhong;
    const phong = await Phong.getPhongById(maPhong);

    if (!phong) {
      return res.render("phong/chitiet", { error: "Không tìm thấy phòng", phong: null });
    }

    // --- BỔ SUNG: Lấy danh sách đánh giá ---
    // Đã thay đổi các tên cột không phù hợp để khớp với ảnh phpMyAdmin của bạn:
    // 1. dg.MaKH -> dg.MaKhachHang
    // 2. kh.MaKH -> tk.MaTaiKhoan (Giả định bảng taikhoan dựa trên luồng code trước)
    // 3. dg.NgayDG -> dg.NgayDang
    const [danhGia] = await db.query(
      `SELECT dg.*, tk.TaiKhoan 
       FROM danhgia dg 
       JOIN taikhoan tk ON dg.MaKhachHang = tk.MaTaiKhoan 
       WHERE dg.MaPhong = ? 
       ORDER BY dg.NgayDang DESC`, 
      [maPhong]
    );

    res.render("phong/chitiet", {
      phong,
      danhGia: danhGia || [], // Truyền mảng đánh giá sang View
      user: req.session.user || null, // Giữ user để đồng bộ giao diện header
      error: null,
    });
  } catch (err) {
    console.error("❌ Lỗi xemChiTietPhong:", err.message);
    res.render("phong/chitiet", { error: "Có lỗi xảy ra khi tải dữ liệu", phong: null });
  }
};