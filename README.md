Tourist_Accommodation_Management_System_ThieuNu/
│
├── package.json
├── server.js                # file khởi động ứng dụng
│
├── config/                  # Cấu hình (DB, JWT, Cloud, v.v.)
│   ├── db.js
│   └── config.env
│
├── src/
│   ├── models/              # Mô hình dữ liệu (MongoDB hoặc SQL)
│   │   ├── user.model.js
│   │   ├── room.model.js
│   │   ├── booking.model.js
│   │   └── provider.model.js
│   │
│   ├── controllers/         # Bộ điều khiển (xử lý logic)
│   │   ├── user.controller.js
│   │   ├── room.controller.js
│   │   ├── provider.controller.js
│   │   ├── admin.controller.js
│   │   └── auth.controller.js
│   │
│   ├── routes/              # Định tuyến
│   │   ├── user.routes.js
│   │   ├── room.routes.js
│   │   ├── provider.routes.js
│   │   ├── admin.routes.js
│   │   └── auth.routes.js
│   │
│   ├── middlewares/         # Các middleware (xác thực, phân quyền)
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   │
│   ├── views/               # Giao diện (nếu dùng EJS, Handlebars, v.v.)
│   │   ├── layout.ejs
│   │   ├── home.ejs
│   │   ├── rooms/
│   │   ├── providers/
│   │   └── admin/
│   │
│   ├── public/              # Tài nguyên tĩnh (CSS, JS, hình ảnh)
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   │
│   └── utils/               # Hàm tiện ích, xử lý phụ
│       ├── email.js
│       ├── response.js
│       └── validation.js
│
└── README.md
<img width="956" height="663" alt="image" src="https://github.com/user-attachments/assets/5655c10c-11f0-4960-8bfe-08ddd23d6b59" />
