<div align="center">

# Tourist Accommodation Management System

**A booking and accommodation management platform for customers, providers, and administrators.**

[![Node.js](https://img.shields.io/badge/Node.js-Express.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![EJS](https://img.shields.io/badge/View-EJS-B4CA65)](https://ejs.co/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52B0E7?logo=sequelize&logoColor=white)](https://sequelize.org/)
[![VNPay](https://img.shields.io/badge/Payment-VNPay-005BAC)](https://vnpay.vn/)
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

</div>

## Overview

Tourist Accommodation Management System is a server-rendered web application for accommodation booking workflows. It supports customer booking, provider room management, administrator moderation, payment handling, reviews, and commission reporting.

The project demonstrates:

- Customer flows for registration, login, room search, booking, payment, booking history, cancellation, profile management, and reviews.
- Provider flows for registration, login, room listing, room status updates, booking management, and dashboard statistics.
- Admin flows for dashboards, customer/provider moderation, provider status updates, commission reports, and PDF/Excel exports.
- Payment and reporting features using VNPay, QR code generation, PDF generation, Excel exports, and email notification support.

> **Project status:** this repository is suitable for academic demonstrations, booking workflow testing, and full-stack web development practice. Production usage would require hardening of secrets, deployment configuration, logging, validation, and payment environment controls.

## Core Workflows

```text
Customer searches rooms
-> views room details
-> submits booking information
-> confirms booking
-> pays through VNPay or QR-supported flow
-> views booking history
-> reviews completed booking
```

```text
Provider registers account
-> waits for admin approval
-> manages rooms and room status
-> handles booking requests
-> monitors monthly/yearly statistics
```

```text
Admin reviews customers/providers
-> monitors dashboard statistics
-> updates provider status
-> exports commission and dashboard reports
```

## Main Modules

| Module | Main responsibility |
| --- | --- |
| Customer | Authentication, room search, booking, payment, order history, reviews, profile management |
| Provider | Provider account, room CRUD, room status, booking management, dashboard charts |
| Admin | Customer/provider management, dashboards, provider moderation, commission reporting |
| Payment | VNPay payment creation, VNPay return verification, QR/payment pages |
| Reporting | Dashboard export, commission PDF export, commission Excel export |
| Address / Room Catalog | Province/ward lookup, room type APIs, room detail and search pages |

## Technical Stack

| Area | Technologies |
| --- | --- |
| Runtime | Node.js, Express.js |
| Views | EJS, Express EJS Layouts, Bootstrap, custom CSS |
| Database | MySQL, Sequelize, MySQL-backed session store |
| Authentication & Sessions | Express Session, bcryptjs, middleware-based route guards |
| Payments & Reports | VNPay, QRCode, PDFKit/pdfmake, ExcelJS |
| Utilities | Multer, Nodemailer, date-fns, Day.js, Moment Timezone |

## Repository Structure

```text
.
|-- config/                 # Database configuration
|-- resources/              # Supporting resources
|-- src/
|   |-- controllers/        # Customer, provider, admin, payment, report controllers
|   |-- middlewares/        # Auth and role guards
|   |-- models/             # Database models and data access modules
|   |-- public/             # Static assets, CSS, client-side JS, uploaded images
|   |-- routes/             # Express route modules
|   `-- views/              # EJS pages and layouts
|-- server.js               # Express application entry point
|-- package.json
`-- README.md
```

## Key Routes

| Area | Example routes |
| --- | --- |
| Public pages | `/`, `/phong`, `/phong/chi-tiet/:maPhong`, `/timkiem` |
| Customer | `/khachhang/dangky`, `/khachhang/dangnhap`, `/khachhang/don-dat-phong` |
| Booking | `/khachhang/dat-phong/:maPhong`, `/khachhang/dat-phong/preview`, `/khachhang/dat-phong/xac-nhan` |
| Provider | `/nhacungcap`, `/nhacungcap/phong`, `/nhacungcap/don-dat-phong` |
| Admin | `/admin/dashboard`, `/admin/customers`, `/admin/providers`, `/admin/reports/commission` |
| Payment | `/vnpay/create_payment`, `/vnpay/return` |
| Reports | `/admin/dashboard/export`, `/admin/dashboard/export-excel`, `/admin/reports/commission/export/pdf` |

## Run With Docker

Docker runs both the Node.js application and the MariaDB database, so XAMPP is
not required. MariaDB is used because the included database dump was exported
from MariaDB 10.4 through phpMyAdmin.

### Prerequisites

- Docker Desktop
- Docker Compose

### Start the project

Create your local environment file:

```bash
cp .env.example .env
```

Change the passwords and `SESSION_SECRET` in `.env`, then build and start the
containers:

```bash
docker compose up --build -d
```

Check container status:

```bash
docker compose ps
```

Open the application:

```text
http://localhost:3000
```

The database dump at `resources/quanlidatphong (8).sql` is imported
automatically the first time the database volume is created. From the host
machine, MariaDB is available on `localhost:3307`. The container also enables
case-insensitive table names to preserve compatibility with SQL written for
the original Windows/XAMPP environment.

### View logs

```bash
docker compose logs -f app
```

### Stop the project

```bash
docker compose down
```

To delete the database volume and import the original SQL dump again:

```bash
docker compose down -v
docker compose up --build -d
```

## Run Without Docker

### Prerequisites

- Node.js 20+
- MySQL
- npm

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a local `.env` file with the database and payment settings required by your environment.

```text
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
SESSION_SECRET=your_session_secret
```

VNPay and email settings should be configured according to the payment/email environment being used.

### Start the app

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

## Evidence

The application includes customer, provider, admin, payment, and reporting pages. The existing project screenshot below shows the visual UI direction:

<img width="802" height="615" alt="Tourist Accommodation Management System screenshot" src="https://github.com/user-attachments/assets/02d8e453-d8c8-4302-87a5-1fe18badd426" />

## Current Limitations

- This is an academic full-stack project, not a production-hardened deployment.
- Payment credentials, email credentials, and session secrets should be managed through secure environment variables before deployment.
- The repository currently focuses on server-rendered web flows rather than API-first frontend/backend separation.
- Automated test coverage is not yet the main focus of this project.
