// config/upload.js
const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu file và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images")); // thư mục lưu file (tạo sẵn)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // ví dụ: 17189911123.png
  }
});

const uploadImage = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif/;
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype;
        if (allowed.test(ext) && allowed.test(mime)) {
        cb(null, true);
        } else {
          req.fileValidationError = 'Chỉ chấp nhận file hình ảnh (jpg, png, gif)!';
          cb(null, false);
        // cb(new Error('Chỉ chấp nhận file hình ảnh (jpg, png, gif)!'));
        }
    }
});

module.exports = uploadImage;
