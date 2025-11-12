require('dotenv').config();
const moment = require('moment');
const qs = require('qs');
const crypto = require('crypto');
const db = require('../../config/db');

// Bỏ dấu TV
function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^\x00-\x7F]/g, '');
}

// Sắp xếp key A→Z
function sortObject(obj) {
  const sorted = {};
  Object.keys(obj).sort().forEach(k => sorted[k] = obj[k]);
  return sorted;
}

// Chuẩn hoá IP về IPv4 để VNPay không “lệch” khi tính hash
function normalizeIp(req) {
  const raw =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    '127.0.0.1';

  if (raw === '::1') return '127.0.0.1';
  if (raw.startsWith('::ffff:')) return raw.slice(7);
  return raw;
}

exports.createPayment = async (req, res) => {
  try {
    const { amount, orderId, maNCC } = req.body;

    // Thông tin NCC
    const [rows] = await db.query('SELECT * FROM nhacungcap WHERE MaNCC = ?', [maNCC]);
    const supplier = rows[0];
    if (!supplier) return res.status(404).send('Không tìm thấy nhà cung cấp.');

    // ENV
    const tmnCode   = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl    = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURNURL;

    const now        = new Date();
    const createDate = moment(now).format('YYYYMMDDHHmmss');
    const expireDate = moment(now).add(15, 'minutes').format('YYYYMMDDHHmmss');
    const ipAddr     = normalizeIp(req);

    // Nội dung không dấu
    const orderInfoText = `Thanh toan don ${orderId} cho NCC ${removeVietnameseTones(supplier.TenNCC)}`;
     // 1️⃣ Tạo params
     let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: String(orderId),
      vnp_OrderInfo: orderInfoText,
      vnp_OrderType: 'other',
      vnp_Amount: Number(amount) * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };
    vnp_Params.vnp_TxnRef = `${orderId}_${Date.now()}`;
    // 2) Sắp xếp & ký (PHẢI encode khi ký theo RFC1738)
    vnp_Params = sortObject(vnp_Params);

    // VNPay dùng chuỗi encode (RFC1738) để hash
    const signData = qs.stringify(vnp_Params, { encode: true, format: 'RFC1738' });
    const signed   = crypto.createHmac('sha512', secretKey)
                          .update(Buffer.from(signData, 'utf-8'))
                          .digest('hex');
    vnp_Params.vnp_SecureHash = signed;

    // 3) URL cuối cùng cũng encode RFC1738
    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: true, format: 'RFC1738' })}`;


    console.log('🟩 VNPay URL:', paymentUrl);
    console.log('🧩 signData gửi:', signData);
    console.log('🧩 chữ ký tạo:', signed);

    return res.render('khachhang/payment_qr', {
      paymentUrl, supplier, session: req.session
    });
  } catch (err) {
    console.error('❌ Lỗi VNPay:', err);
    return res.status(500).send('Lỗi khi tạo thanh toán VNPay.');
  }
};

exports.vnpayReturn = async (req, res) => {
  try {
    // 📦 Sao chép toàn bộ query từ VNPay trả về
    let vnp_Params = { ...req.query };

    // 🔐 Lưu hash từ VNPay và loại bỏ khỏi params trước khi tính lại
    const secureHashRecv = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    // 🧩 Sắp xếp tham số theo alphabet (A-Z)
    vnp_Params = sortObject(vnp_Params);

    // 🧾 Chuỗi ký phải encode RFC1738 giống VNPay
    const signData = qs.stringify(vnp_Params, { encode: true, format: 'RFC1738' });

    // 🔒 Tính lại hash với HMAC SHA512
    const secureHashCalc = crypto
      .createHmac('sha512', process.env.VNP_HASHSECRET)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    // 🧠 Debug log
    console.log('🔍 Return Params:', vnp_Params);
    console.log('🔑 SecureHash (nhận):', secureHashRecv);
    console.log('🔑 SecureHash (tính):', secureHashCalc);

    // ❌ Nếu hash không trùng -> cảnh báo tấn công hoặc lỗi encoding
    if (secureHashRecv !== secureHashCalc) {
      return res.render('khachhang/payment_success', {
        success: false,
        message: 'Sai chữ ký VNPay. Dữ liệu không hợp lệ.'
      });
    }

    // ✅ Hash hợp lệ -> xử lý kết quả thanh toán
    const orderId = vnp_Params.vnp_TxnRef;
    const respCode = vnp_Params.vnp_ResponseCode;
    const amount = Number(vnp_Params.vnp_Amount) / 100;

    if (respCode === '00') {
      const transactionNo = vnp_Params.vnp_TransactionNo;
      const payDate = vnp_Params.vnp_PayDate;
      // 💾 Cập nhật trạng thái đơn
      await db.query('UPDATE dondatphong SET TrangThai = ? WHERE MaDon = ?', [2, orderId]);

      // 💰 Ghi nhận thanh toán
      await db.query('INSERT INTO thanhtoan (MaDon, NgayTT, SoTien) VALUES (?, NOW(), ?)', [orderId, amount]);

      return res.render('khachhang/payment_success', {
        success: true,
        orderId,
        amount,
        transactionNo,   // ✅ thêm dòng này
        payDate,         // ✅ và dòng này
        message: 'Thanh toán thành công!'
      });
    } else {
      return res.render('khachhang/payment_success', {
        success: false,
        orderId,
        message: `Thanh toán không thành công (Mã lỗi: ${respCode}).`
      });
    }
  } catch (err) {
    console.error('❌ Lỗi xử lý VNPay return:', err);
    return res.status(500).send('Lỗi khi xác thực thanh toán.');
  }
};
