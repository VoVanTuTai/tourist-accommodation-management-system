const db = require('../../config/db');

// =============================
// Xử lý tìm kiếm phòng
// =============================
exports.timKiemPhong = async (req, res) => {
  try {
    let { maLoai, maTinh, maXa, giaMin, giaMax, checkin, checkout } = req.query;

    giaMin = giaMin ? parseFloat(giaMin) : 0;
    giaMax = giaMax ? parseFloat(giaMax) : Number.MAX_SAFE_INTEGER;

    if (giaMin < 0 || giaMax < 0 || giaMin > giaMax) {
      return res.render('khachhang/danhsachphong', {
        phongList: [],
        message: 'Khoảng giá không hợp lệ!',
        query: req.query
      });
    }

    let query = `
      SELECT 
        p.MaPhong, p.TenPhong, p.MaLoai, p.Gia, p.HinhAnh, p.SucChua, 
        p.TinhTrang, p.DanhGia, 
        lp.TenLoai, Xa.TenXa, t.TenTinh
      FROM Phong p
      JOIN LoaiPhong lp ON p.MaLoai = lp.MaLoai
      JOIN DiaChi d ON p.MaDiaChi = d.MaDiaChi
      JOIN Xa ON d.MaXa = Xa.MaXa
      JOIN Tinh t ON Xa.MaTinh = t.MaTinh
      WHERE p.TinhTrang = 1
    `;
    const params = [];

    if (maLoai && maLoai !== '') {
      query += ` AND p.MaLoai = ?`;
      params.push(maLoai);
    }
    if (maTinh && maTinh !== '') {
      query += ` AND t.MaTinh = ?`;
      params.push(maTinh);
    }
    if (maXa && maXa !== '') {
      query += ` AND Xa.MaXa = ?`;
      params.push(maXa);
    }
    if (giaMin || giaMax) {
      query += ` AND p.Gia BETWEEN ? AND ?`;
      params.push(giaMin, giaMax);
    }

    query += ` ORDER BY p.Gia ASC`;

    const [rows] = await db.execute(query, params);

    if (rows.length === 0) {
      return res.render('khachhang/danhsachphong', {
        phongList: [],
        message: 'Không tìm thấy phòng phù hợp.',
        query: req.query
      });
    }

    rows.forEach(p => {
      p.DanhGia = Number(p.DanhGia) || 0;
    });

    res.render('khachhang/danhsachphong', {
      phongList: rows,
      message: null,
      query: req.query
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('khachhang/danhsachphong', {
      phongList: [],
      message: 'Lỗi hệ thống khi tìm kiếm phòng.',
      query: req.query
    });
  }
};
