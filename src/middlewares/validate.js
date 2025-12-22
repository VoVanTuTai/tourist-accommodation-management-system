// views/utils/validator.js
const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
/**
 * Kiểm tra họ tên: ít nhất 5 ký tự, không toàn số, không ký tự đặc biệt.
 */
function isValidFullname(fullname) {
  if (typeof fullname !== 'string') return false;
  const trimmed = fullname.trim();
  const regex = /^([A-Z].+)( [A-Z].+)+$/;
  return regex.test(trimmed);
}

/**
 * Kiểm tra email hợp lệ: Email phải có ký tự @ và kết thúc với .com
 */
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;
  return regex.test(email.trim());
}

/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ.
 * Số điện thoại không được rỗng, có định dạng 10 số, được bắt đầu với 09,03,08
 */
function isValidVietnamPhone(phone) {
  if (typeof phone !== 'string') return false;
  const regex = /^(09|03|08)[0-9]{8}$/;
  return regex.test(phone.trim());
}

/**
 * Kiểm tra mật khẩu mạnh:
 * - Ít nhất 8 ký tự
 * - Có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
 * - Không chứa khoảng trắng
 */
function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/;
  return regex.test(password);
}

function isValidDate(dateString) {
  try {
      console.log("isValidDate dateString:", dayjs(dateString).format("DD/MM/YYYY"));
      const formatedDate = dayjs(dateString, "DD/MM/YYYY", true).format("YYYY-MM-DD");
      const isValid = dayjs(formatedDate, "YYYY-MM-DD", true).isValid();
      if (isValid && (dayjs().isAfter(formatedDate, "day") || dayjs().isSame(formatedDate, "day"))) {
        return true;
      }
      return false;
  } catch (error) {
      console.error("isValidDate error:", error);
      return false;
  }
}

module.exports = {
  isValidFullname,
  isValidEmail,
  isValidVietnamPhone,
  isValidPassword,
  isValidDate,
};
