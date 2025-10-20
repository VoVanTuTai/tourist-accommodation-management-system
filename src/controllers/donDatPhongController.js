const DonDatPhong = require('../models/DonDatPhong');

exports.danhSachDonDatPhong = async (req, res) => {
  try {
    const userId = 1; // tạm thời test
    const trangThai = req.query.trangthai || ""; // 0, 1, 2, 3 hoặc rỗng

    // ✅ Gọi model bằng async/await (vì getAllByUser trả về Promise)
    const donDatPhongList = await DonDatPhong.getAllByUser(userId, trangThai);

    // ✅ Chuyển các chuỗi ngày thành đối tượng Date để EJS hiển thị đẹp
    const formattedList = donDatPhongList.map(don => ({
      ...don,
      NgayDat: don.NgayDat ? new Date(don.NgayDat) : null,
      NgayNhan: don.NgayNhan ? new Date(don.NgayNhan) : null,
      NgayTra: don.NgayTra ? new Date(don.NgayTra) : null,
    }));

    // ✅ Render dữ liệu ra view
    res.render("khachhang/danhsachdondatphong", {
      donDatPhongList: formattedList,
      trangThai,
    });

  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách đơn đặt phòng:");
    console.error("📄 Chi tiết lỗi:", err.message);
    console.error("📂 Stack:", err.stack);
    res.status(500).send("Lỗi khi tải danh sách đơn đặt phòng: " + err.message);
  }
  
};
exports.chiTietDonDatPhong = async (req, res) => {
  try {
    const maDon = req.params.id;

    const rows = await DonDatPhong.getChiTietDon(maDon);
    if (!rows || rows.length === 0) {
      return res.status(404).send("Không tìm thấy đơn đặt phòng.");
    }

    // Thông tin chung (dòng đầu)
    const thongTinDon = rows[0];
    const danhSachPhong = rows.map((r) => ({
      TenPhong: r.TenPhong,
      TenLoai: r.TenLoai,
      TenNCC: r.TenNCC,
      Gia: r.Gia,
    }));

    res.render("khachhang/chitietdondatphong", {
      don: thongTinDon,
      danhSachPhong,
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết đơn đặt phòng:", err.message);
    res.status(500).send("Lỗi khi tải chi tiết đơn đặt phòng.");
  }
};
// HỦY ĐƠN ĐẶT PHÒNG
exports.huyDonDatPhong = async (req, res) => {
  try {
    const maDon = req.params.id;

    if (!maDon) {
      return res.status(400).send("Thiếu mã đơn để hủy.");
    }

    // Trạng thái 3 = Đã hủy
    await DonDatPhong.updateTrangThai(maDon, 3);

    console.log(`🗑️ Đơn đặt phòng #${maDon} đã được hủy.`);
    res.redirect("/khachhang/don-dat-phong");
  } catch (err) {
    console.error("❌ Lỗi khi hủy đơn đặt phòng:", err.message);
    res.status(500).send("Lỗi khi hủy đơn đặt phòng.");
  }
};
