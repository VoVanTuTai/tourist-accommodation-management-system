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
        query: req.query,
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

    // =============================
    // QUERY GỐC
    // =============================
    let query = `
      SELECT DISTINCT
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

    // =============================
    // FILTER CƠ BẢN
    // =============================
    if (maLoai) {
      query += ` AND p.MaLoai = ?`;
      params.push(maLoai);
    }

    if (maTinh) {
      query += ` AND t.MaTinh = ?`;
      params.push(maTinh);
    }

    if (maXa) {
      query += ` AND Xa.MaXa = ?`;
      params.push(maXa);
    }

    query += ` AND p.Gia BETWEEN ? AND ?`;
    params.push(giaMin, giaMax);

    // =============================
    // FILTER CHECKIN / CHECKOUT
    // (chỉ áp dụng khi có đủ 2 giá trị)
    // =============================
    if (checkin && checkout) {
      query += `
        AND p.MaPhong NOT IN (
          SELECT DISTINCT ctdp.MaPhong
          FROM ChiTietDonDatPhong ctdp
          JOIN DonDatPhong ddp ON ctdp.MaDon = ddp.MaDon
          WHERE ddp.TrangThai <> 2
            AND NOT (
              ddp.NgayTra <= ? OR ddp.NgayNhan >= ?
            )
        )
      `;
      params.push(checkin, checkout);
    }

    query += ` ORDER BY p.Gia ASC`;

    // =============================
    // EXECUTE
    // =============================
    const [rows] = await db.execute(query, params);

    rows.forEach(p => {
      p.DanhGia = Number(p.DanhGia) || 0;
    });

    res.render('khachhang/danhsachphong', {
      phongList: rows,
      message: rows.length === 0 ? 'Không tìm thấy phòng phù hợp.' : null,
      query: req.query,
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
    console.error(err);
    res.status(500).render('khachhang/danhsachphong', {
      phongList: [],
      message: 'Lỗi hệ thống khi tìm kiếm phòng.',
      query: req.query,
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
