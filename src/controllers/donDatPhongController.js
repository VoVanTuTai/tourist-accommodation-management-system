const DonDatPhong = require('../models/DonDatPhong');

exports.danhSachDonDatPhong = async (req, res) => {
  try {
    const userId = req.session.user.id; // Lấy ID khách hàng từ session đăng nhập
    const trangThai = req.query.trangthai; // Lấy giá trị lọc

    let query = { idKhachHang: userId };
    if (trangThai) {
      query.trangThai = trangThai;
    }

    const donDatPhongList = await DonDatPhong.findAll({ where: query });

    res.render('khachhang/danhsachdondatphong', { donDatPhongList });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi tải danh sách đơn đặt phòng.');
  }
};
