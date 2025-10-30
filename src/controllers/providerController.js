const Provider = require("../models/providerModel");
const { sendMail } = require("../../config/adminMail"); // ✅ Dự phòng nếu muốn bật gửi mail

// ===============================
// 🟢 Lấy toàn bộ nhà cung cấp
// ===============================
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.getAllProviders();
    res.render("admin/providers", {
      providers,
      notFound: false,
      successMessage: null,
    });
  } catch (err) {
    console.error("❌ Lỗi getAllProviders:", err);
    res.render("admin/providers", {
      providers: [],
      notFound: true,
      successMessage: null,
    });
  }
};

// ===============================
// 🟡 Lọc danh sách theo trạng thái
// ===============================
exports.filterProviders = async (req, res) => {
  try {
    const { TrangThai } = req.query;
    const filtered = await Provider.getProvidersByStatus(TrangThai);

    if (filtered.length > 0) {
      res.render("admin/providers", {
        providers: filtered,
        notFound: false,
        successMessage: null,
      });
    } else {
      res.render("admin/providers", {
        providers: [],
        notFound: true,
        successMessage: null,
      });
    }
  } catch (err) {
    console.error("❌ Lỗi filterProviders:", err);
    res.render("admin/providers", {
      providers: [],
      notFound: true,
      successMessage: null,
    });
  }
};

// ===============================
// 🔴 Cập nhật trạng thái nhà cung cấp
// ===============================
exports.updateProviderStatus = async (req, res) => {
  try {
    const { MaTaiKhoan, TrangThai } = req.body;

    let newStatus = "";
    let thaoTac = "";
    let subject = "";
    let message = "";

    // 🔁 Quy đổi trạng thái và chuẩn bị nội dung mail
    switch (TrangThai) {
      case "HoatDong":
        newStatus = "HoatDong";
        thaoTac = "phê duyệt / mở khóa";
        subject = "Tài khoản nhà cung cấp đã được kích hoạt";
        message = `
          <p>Xin chào,</p>
          <p>Tài khoản của bạn trên <b>Tourist Accommodation Management System</b> đã được <b>kích hoạt</b>.</p>
          <p>Trạng thái hiện tại: <b>Đang hoạt động</b>.</p>
          <p>Trân trọng,<br>Đội ngũ quản trị hệ thống.</p>
        `;
        break;

      case "Khoa":
        newStatus = "Khoa";
        thaoTac = "khóa / từ chối";
        subject = "Tài khoản nhà cung cấp đã bị khóa";
        message = `
          <p>Xin chào,</p>
          <p>Tài khoản của bạn trên <b>Tourist Accommodation Management System</b> đã bị <b>tạm khóa</b>.</p>
          <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ bộ phận kỹ thuật 0386861386.</p>
          <p>Trân trọng,<br>Đội ngũ quản trị hệ thống.</p>
        `;
        break;

      default:
        newStatus = "ChoDuyet";
        thaoTac = "chờ duyệt";
        subject = "Tài khoản đang chờ duyệt";
        message = `
          <p>Xin chào,</p>
          <p>Tài khoản của bạn hiện đang ở trạng thái <b>Chờ duyệt</b>.</p>
          <p>Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.</p>
          <p>Trân trọng,<br>Đội ngũ quản trị hệ thống.</p>
        `;
    }

    // ✅ Cập nhật CSDL
    const success = await Provider.updateProviderStatus(MaTaiKhoan, newStatus);
    const providers = await Provider.getAllProviders();

    if (success) {
      // ✅ Gửi email thông báo (nếu có cột Email trong DB)
      const provider = providers.find((p) => p.MaTaiKhoan == MaTaiKhoan);
      if (provider && provider.Email) {
        await sendMail(provider.Email, subject, message);
      }

      res.render("admin/providers", {
        providers,
        notFound: false,
        successMessage: `Thao tác "${thaoTac}" thành công!`,
      });
    } else {
      res.render("admin/providers", {
        providers: [],
        notFound: true,
        successMessage: null,
      });
    }
  } catch (err) {
    console.error("❌ Lỗi updateProviderStatus:", err);
    res.render("admin/providers", {
      providers: [],
      notFound: true,
      successMessage: null,
    });
  }
};
