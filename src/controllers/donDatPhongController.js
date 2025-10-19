const DonDatPhong = require('../models/DonDatPhong');

exports.danhSachDonDatPhong = (req, res) => {
  const userId = 1; // tạm thời test
  const trangThai = req.query.trangthai; // 0, 1, 2, 3 hoặc undefined

  DonDatPhong.getAllByUser(userId, trangThai, (err, donDatPhongList) => {
    if (err) {
      console.error("❌ Lỗi SQL:", err);
      return res.status(500).send("Lỗi khi tải danh sách đơn đặt phòng.");
    }

    // ✅ Chuyển các chuỗi ngày thành đối tượng Date (để EJS dùng .toLocaleDateString)
    const formattedList = donDatPhongList.map(don => ({
      ...don,
      NgayDat: don.NgayDat ? new Date(don.NgayDat) : null,
      NgayNhan: don.NgayNhan ? new Date(don.NgayNhan) : null,
      NgayTra: don.NgayTra ? new Date(don.NgayTra) : null,
    }));

    // ✅ Render và truyền đủ dữ liệu cho EJS
    res.render("khachhang/danhsachdondatphong", {
      donDatPhongList: formattedList,  // dùng danh sách đã format
      trangThai: trangThai || "",      // để navbar highlight đúng tab
    });
  });
};
