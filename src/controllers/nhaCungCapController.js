const NhaCungCap = require("../models/NhaCungCap") // Model phòng
const bcrypt = require("bcryptjs")
const TaiKhoan = require("../models/taikhoan")
const db = require("../../config/db");
const DiaChi = require("../models/DiaChi");
const Phong = require("../models/phong");

const {
    isValidFullname,
    isValidEmail,
    isValidVietnamPhone,
    isValidPassword,
    isValidDate
} = require("../middlewares/validate")
const fs = require("fs")
const path = require("path")
const e = require("express")
const { error } = require("console");
const dayjs=require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const jsLibraries = [
    "https://cdn-script.com/ajax/libs/jquery/3.7.1/jquery.min.js",
    "/js/nhacungcap/dangky.js",
]

exports.renderDangKyNhaCungCap = async (req, res) => {
    // 🧭 Lấy danh sách tỉnh và xã (để hiển thị select)
    const [tinhs] = await db.execute("SELECT * FROM Tinh");

    res.render("nhacungcap/dangky", {
        title: "Đăng ký nhà cung cấp",
        js: jsLibraries, // Gán JS riêng cho view đăng ký nhà cung cấp,
        errors: {},
        formData: {},
        tinhs
    })
}
exports.renderDashboard = async (req, res) => {
  // 🧭 Lấy danh sách tỉnh và xã (để hiển thị select)
  const maNCC = req.session.user.MaNCC;
  if (!maNCC) return res.status(401).send("⚠️ Vui lòng đăng nhập trước khi sửa phòng.");

  let dateErrors = {};
  let statsByYear = req.query.statsByYear || new Date().getFullYear();
  let statsByMonth = req.query.statsByMonth || (new Date().getMonth() + 1) + '/' + new Date().getFullYear();

  if (statsByYear) {
    const testDate = `01/01/${statsByYear}`;
    if (!isValidDate(testDate)) {
      return res.status(400).send("⚠️ Năm không hợp lệ.");
    }
  }
  if (statsByMonth) {
    const [month, year] = statsByMonth.split('/');
    const testDate = `01/${month}/${year}`;
    if (!isValidDate(testDate)) {
      return res.status(400).send("⚠️ Tháng/năm không hợp lệ.");
    }
  }

  const tongPhong = await NhaCungCap.getTongSoPhong(maNCC);
  const tongDonDatPhong = await NhaCungCap.getTongSoDonDatPhong(maNCC);
  const tongDoanhThu = await NhaCungCap.getTongDoanhThu(maNCC);

  const currentDate = new Date();
  const maxDoanhThuTheoNam = await NhaCungCap.getMaxDoanhThuTheoNam(maNCC, statsByYear);
  const doanhThuThangTheoNam = await NhaCungCap.getDoanhThuThangTheoNam(maNCC, statsByYear);
  const thongKePhong = await NhaCungCap.getThongKePhong(maNCC);
  const thongKeDonDatPhong = await NhaCungCap.getThongKeDonDatPhong(maNCC);
  const maxDoanhThuTheoThang = await NhaCungCap.getMaxDoanhThuTheoThang(maNCC, dayjs(statsByMonth, 'MM/YYYY').month() + 1, dayjs(statsByMonth, 'MM/YYYY').year());
  const doanhThuTheoThang = await NhaCungCap.getDoanhThuThangTheoThang(maNCC, dayjs(statsByMonth, 'MM/YYYY').month() + 1, dayjs(statsByMonth, 'MM/YYYY').year());

  res.render("nhacungcap/dashboard", {
    data: {
      tongPhong: tongPhong,
      tongDonDatPhong: tongDonDatPhong,
      phongBaoTri: 10,
      tongDoanhThu: tongDoanhThu,
      doanhThuThangTheoNam: doanhThuThangTheoNam,
      maxDoanhThuTheoNam: maxDoanhThuTheoNam,
      thongKePhong: thongKePhong,
      thongKeDonDatPhong: thongKeDonDatPhong,
      doanhThuTheoThang: doanhThuTheoThang,
      maxDoanhThuTheoThang: maxDoanhThuTheoThang,
    },
    title: "Dashboard Nhà Cung Cấp",
    errors: {
      dateErrors
    },
    formData: {},
    statsByYear: currentDate.getFullYear(),
    statsByMonth: (currentDate.getMonth() + 1) + '/' + currentDate.getFullYear(),
    // layout: false // Sử dụng layout khác cho dashboard
  })
}

exports.registerNhaCungCap = async (req, res) => {
    const [tinhs] = await db.execute("SELECT * FROM Tinh");
    await db.query('START TRANSACTION;');

    try {
        const {
            TenNCC,
            Email,
            Phone,
            LoaiNganHang,
            ThongTinThanhToan,
            LoaiHinh,
            Password,
            ConfirmPassword,
            Tinh,
            Xa,
            DiaChiChiTiet
        } = req.body
        const errors = {}

        if (!isValidFullname(TenNCC)) {
            errors.TenNCC =
                "Tên nhà cung cấp không hợp lệ. Ít nhất 5 ký tự, không toàn số, không ký tự đặc biệt."
        }
        if (!isValidEmail(Email)) {
            errors.Email =
                "Email không hợp lệ. Phải có ký tự @ và kết thúc với .com"
        }
        if (!isValidVietnamPhone(Phone)) {
            errors.Phone =
                "Số điện thoại không hợp lệ. Phải là số điện thoại Việt Nam bắt đầu bằng 09, 03 hoặc 08 và có 10 chữ số."
        }
        if (!isValidPassword(Password)) {
            errors.Password =
                "Mật khẩu không hợp lệ. Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
        }
        if (!Tinh || Tinh.trim() === "") {
            errors.Tinh = "Vui lòng chọn tỉnh."
        }
        if (!Xa || Xa.trim() === "") {
            errors.Xa = "Vui lòng chọn xã."
        }
        if (!DiaChiChiTiet || DiaChiChiTiet.trim() === "") {
            errors.DiaChiChiTiet = "Vui lòng nhập địa chỉ chi tiết."
        }
        if (Password !== ConfirmPassword) {
            errors.ConfirmPassword = "Mật khẩu xác nhận không khớp."
        }
        if (!LoaiNganHang || LoaiNganHang.trim() === "") {
            errors.LoaiNganHang = "Vui lòng chọn loại ngân hàng."
        }
        if (!LoaiHinh || LoaiHinh.trim() === "") {
            errors.LoaiHinh = "Vui lòng chọn loại hình nhà cung cấp."
        }
        if (ThongTinThanhToan.length < 5 || ThongTinThanhToan.length > 15) {
            errors.ThongTinThanhToan =
                "Thông tin thanh toán không hợp lệ. Ít nhất 5 chữ số và tối đa 15."
        }
        // Nếu có file upload, lấy tên file, còn không thì dùng giá trị rỗng
        const giayPhepKD = req.file ? req.file.originalname : ""

        if (!giayPhepKD) {
            errors.GiayPhepKD = "Vui lòng cung cấp giấy phép kinh doanh."
        }

        if (Object.keys(errors).length > 0) {
            // // Nếu có lỗi, xóa file đã tải lên (nếu có)
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) console.error("Lỗi xóa file ảnh:", err)
                })
            }
            return res.status(400).render("nhacungcap/dangky", {
                title: "Đăng ký nhà cung cấp",
                js: jsLibraries,
                errors,
                formData: req.body,
                tinhs
            })
        }

        const data = {
            TenNCC: TenNCC,
            LoaiNganHang: LoaiNganHang,
            ThongTinThanhToan: ThongTinThanhToan,
            LoaiHinh: LoaiHinh,
            GiayPhepKD: giayPhepKD, // ✅ lưu tên file ảnh,
        }
        // Kiểm tra tồn tại tài khoản đăng ký nhà cung cấp
        const isEmailRegistered = await TaiKhoan.findByTaiKhoan(Email)
        if (isEmailRegistered) {
            errors.Email = "Email đã đăng ký."
            // // Nếu có lỗi, xóa file đã tải lên (nếu có)
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) console.error("Lỗi xóa file ảnh:", err)
                })
            }
            return res.status(400).render("nhacungcap/dangky", {
                title: "Đăng ký nhà cung cấp",
                js: jsLibraries,
                errors,
                formData: req.body,
                tinhs
            })
        }
        // Tạo tài khoản đăng nhập ở trạng thái Chờ Duyệt
        const hashedPassword = await bcrypt.hash(Password, 10)
        const maTaiKhoan = await TaiKhoan.create({
            TaiKhoan: Email,
            MatKhau: hashedPassword,
            PhanQuyen: "NhaCungCap",
            TrangThai: "ChoDuyet",
        })
        // Tạo địa chỉ cho nhà cung cấp
        const maDiaChi = await DiaChi.addDiaChi(DiaChiChiTiet, Xa)
        data.MaDiaChi = maDiaChi
        data.MaTaiKhoan = maTaiKhoan
        // Tạo tài khoản cho nhà cung cấp
        const result = await NhaCungCap.create(data)

        await db.query("COMMIT;");
        res.send(`
            <html>
                <body style="font-family: sans-serif; text-align:center; margin-top:100px;">
                <h2 style="color: green;">Đăng ký thành công!</h2>
                <p>Chờ xác nhận tài khoản...</p>
                <p><a href="/">Trở về trang chủ</a></p>
                </body>
            </html>
        `)
    } catch (error) {
        console.error("Xảy ra lỗi trong khi đăng ký nhà cung cấp:", error)
        await db.query("ROLLBACK;");
        res.status(500).render("nhacungcap/dangky", {
            title: "Đăng ký nhà cung cấp",
            js: jsLibraries,
            errors: {},
            formData: req.body,
            tinhs
        })
    }
}
// Xử lý đăng nhập
exports.renderDangNhapNhaCungCap = (req, res) => {
    res.render("nhacungcap/dangnhap", {
        title: "Đăng nhập nhà cung cấp",
        js: jsLibraries,
        errors: null,
        formData: req.body,
    })
}

exports.getChartMonthData = async (req, res) => {
    try {
      const maNCC = req.session.user.MaNCC;
      const { statsByMonth } = req.params;
      if (!statsByMonth) {
        return res.status(400).send("⚠️ Không có thông tin tháng/năm.");
      }
      const [month, year] = statsByMonth.split('-');
      const testDate = `01/${month}/${year}`;
      if (!isValidDate(testDate)) {
        return res.status(400).send("⚠️ Tháng/năm không hợp lệ.");
      }
      const maxDoanhThuTheoThang = await NhaCungCap.getMaxDoanhThuTheoThang(maNCC, parseInt(month), parseInt(year));
      const doanhThuTheoThang = await NhaCungCap.getDoanhThuThangTheoThang(maNCC, parseInt(month), parseInt(year));
      return res.status(200).json({ maxDoanhThuTheoThang, doanhThuTheoThang });
    } catch (error) {
      console.error("Lỗi lấy dữ liệu biểu đồ:", error);
      res.status(500).json({ error: "Lỗi máy chủ" });
    }
};
exports.getChartYearData = async (req, res) => {
    try {
      const maNCC = req.session.user.MaNCC;
      const { statsByYear } = req.params;
      if (!statsByYear) {
        return res.status(400).send("⚠️ Không có thông tin năm.");
      }
      const testDate = `01/01/${statsByYear}`;
      if (!isValidDate(testDate)) {
        return res.status(400).send("⚠️ Năm không hợp lệ.");
      }
      const maxDoanhThuTheoNam = await NhaCungCap.getMaxDoanhThuTheoNam(maNCC, parseInt(statsByYear));
      const doanhThuThangTheoNam = await NhaCungCap.getDoanhThuThangTheoNam(maNCC, parseInt(statsByYear));
      return res.status(200).json({ maxDoanhThuTheoNam, doanhThuThangTheoNam });
    } catch (error) {
      console.error("Lỗi lấy dữ liệu biểu đồ:", error);
      res.status(500).json({ error: "Lỗi máy chủ" });
    }
};

exports.loginNhaCungCap = async (req, res) => {
    try {
      const { Email, Password, Remember } = req.body;
      const errors = {};
  
      // 1️⃣ Kiểm tra dữ liệu nhập
      if (!Email || Email.trim() === "") {
        errors.Email = "Vui lòng nhập email.";
      } else if (!isValidEmail(Email)) {
        errors.Email = "Email không hợp lệ. Phải có ký tự @ và kết thúc với .com";
      }
      if (!Password || Password.trim() === "") {
        errors.Password = "Vui lòng nhập mật khẩu.";
      }
  
      if (Object.keys(errors).length > 0) {
        return res.status(400).render("nhacungcap/dangnhap", {
          title: "Đăng nhập nhà cung cấp",
          js: jsLibraries,
          errors,
          formData: req.body,
        });
      }
      // 2️⃣ Truy vấn tài khoản và thông tin nhà cung cấp (LEFT JOIN)
      const [rows] = await db.execute(
          `SELECT 
              tk.MaTaiKhoan, tk.TaiKhoan, tk.MatKhau, tk.PhanQuyen, tk.TrangThai,
              ncc.MaNCC, ncc.TenNCC
          FROM TaiKhoan tk
          LEFT JOIN NhaCungCap ncc ON tk.MaTaiKhoan = ncc.MaTaiKhoan 
          WHERE tk.TaiKhoan = ?`,
          [Email]
      );

      const account = rows[0];
      if (!account) {
        errors.Email = "Tài khoản Email không tồn tại";
        return res.status(400).render("nhacungcap/dangnhap", {
          title: "Đăng nhập nhà cung cấp",
          js: jsLibraries,
          errors,
          formData: req.body,
        });
      }
      // BỔ SUNG KIỂM TRA QUYỀN VÀ MA_NCC sau khi lấy account
      if (account && account.PhanQuyen === 'NhaCungCap' && !account.MaNCC) {
        // Nếu tài khoản là NCC nhưng MaNCC là NULL/undefined (do LEFT JOIN không khớp)
        errors.Global = "Tài khoản NCC này chưa được liên kết hoặc chưa được duyệt.";
        return res.status(400).render("nhacungcap/dangnhap", {
            // ... (render lỗi)
        });
      }  
      
      // 3️⃣ Kiểm tra mật khẩu
      const passwordMatch = await bcrypt.compare(Password, account.MatKhau);
      if (!passwordMatch) {
        errors.Password = "Mật khẩu không đúng";
        return res.status(400).render("nhacungcap/dangnhap", {
          title: "Đăng nhập nhà cung cấp",
          js: jsLibraries,
          errors,
          formData: req.body,
        });
      }
  
      // 4️⃣ Kiểm tra trạng thái tài khoản
      if (account.TrangThai === "Khoa") {
        errors.Global = "Tài khoản của bạn đã bị khóa";
      } else if (account.TrangThai === "ChoDuyet") {
        errors.Global = "Tài khoản của bạn đang chờ duyệt";
      }
      if (Object.keys(errors).length > 0) {
        return res.status(400).render("nhacungcap/dangnhap", {
          title: "Đăng nhập nhà cung cấp",
          js: jsLibraries,
          errors,
          formData: req.body,
        });
      }
  
      // 5️⃣ Xử lý “Ghi nhớ đăng nhập”
      if (Remember) {
        req.session.cookie.maxAge = 2 * 24 * 60 * 60 * 1000; // 2 ngày
      } else {
        req.session.cookie.expires = false; // Hết khi tắt trình duyệt
      }
  
      // 6️⃣ Tạo session đăng nhập (đã có MaNCC thực)
      req.session.user = {
        MaTaiKhoan: account.MaTaiKhoan,
        TaiKhoan: account.TaiKhoan,
        PhanQuyen: account.PhanQuyen,
        TrangThai: account.TrangThai,
        MaNCC: account.MaNCC, 
        TenNCC: account.TenNCC, 
      };
  
      console.log("✅ NCC đăng nhập:", req.session.user);
  
      // 7️⃣ Chuyển hướng đến danh sách phòng
      res.redirect("/nhacungcap/");
    } catch (err) {
      console.error("❌ Lỗi trong loginNhaCungCap:", err);
      res.status(500).render("nhacungcap/dangnhap", {
        title: "Đăng nhập nhà cung cấp",
        js: jsLibraries,
        errors: { Global: "Lỗi hệ thống, vui lòng thử lại sau." },
        formData: req.body,
      });
    }
  };


// ===============================
// 🔹 Đăng xuất
// ===============================
exports.logoutNhaCungCap = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};
