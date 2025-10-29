const Customer = require("../models/QLcustomerModel");
const { sendMail } = require("../../config/adminMail");

const toDisplay = (s) => ({
  HoatDong: "Đang hoạt động",
  Khoa: "Đã khóa",
}[s] || s);

// Hiển thị danh sách + tìm kiếm khách hàng
exports.listCustomers = async (req, res) => {
  try {
    const keyword = req.query.keyword ? req.query.keyword.trim() : "";
    let customers;

    if (keyword) {
      customers = await Customer.searchByIdOrName(keyword);
    } else {
      customers = await Customer.getAllCustomers();
    }

    customers.forEach((c) => {
      c.TrangThaiHienThi =
        c.TrangThai === "Khoa" ? "Đã khóa" : "Đang hoạt động";
    });

    res.render("admin/customers", { customers, keyword });
  } catch (err) {
    console.error(err);
    res.render("admin/customers", { customers: [], keyword: "" });
  }
};

// Lấy chi tiết khách hàng (AJAX)
exports.getCustomerDetail = async (req, res) => {
  try {
    const maKH = req.params.id;
    const customer = await Customer.findById(maKH);
    if (!customer) return res.json({ success: false });

    customer.TrangThaiHienThi =
      customer.TrangThai === "Khoa" ? "Đã khóa" : "Đang hoạt động";

    res.json({ success: true, customer });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
};

// Cập nhật trạng thái (khóa / mở khóa)
exports.updateStatus = async (req, res) => {
  try {
    const { MaKhachHang, TrangThai } = req.body;
    const newStatus = TrangThai === "HoatDong" ? "HoatDong" : "Khoa";

    const success = await Customer.updateStatus(MaKhachHang, newStatus);

    if (success) {
      const customer = await Customer.findById(MaKhachHang);

      // Gửi email nếu cần
      if (customer?.Email) {
        let subject, html;
        if (newStatus === "Khoa") {
          subject = "Tài khoản khách hàng đã bị khóa";
          html = `
            <p>Xin chào <b>${customer.HoTen}</b>,</p>
            <p>Tài khoản của bạn đã bị <b>tạm khóa</b> bởi quản trị viên.</p>
            <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ lại chúng tôi.</p>
            <p>Trân trọng,<br>Hệ thống quản lý du lịch.</p>`;
        } else {
          subject = "Tài khoản khách hàng đã được mở khóa";
          html = `
            <p>Xin chào <b>${customer.HoTen}</b>,</p>
            <p>Tài khoản của bạn đã được <b>mở khóa và kích hoạt lại</b>.</p>
            <p>Bạn có thể tiếp tục đăng nhập và sử dụng dịch vụ.</p>
            <p>Trân trọng,<br>Hệ thống quản lý du lịch.</p>`;
        }
        await sendMail(customer.Email, subject, html);
      }
    }

    res.redirect("/admin/customers");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/customers");
  }
};

