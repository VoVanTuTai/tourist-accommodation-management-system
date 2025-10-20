-- =========================================================
-- DATABASE: quanlidatphong (phiên bản chuẩn hóa)
-- Author: ChatGPT - Tourist Accommodation Management System
-- Date: 2025-10-19
-- =========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";
SET NAMES utf8mb4;

-- =========================================================
-- BẢNG ADMIN
-- =========================================================
DROP TABLE IF EXISTS `Admin`;
CREATE TABLE `Admin` (
  `MaAdmin` INT AUTO_INCREMENT PRIMARY KEY,
  `HoTen` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Admin` (`MaAdmin`, `HoTen`) VALUES
(1, 'Nguyễn Minh Quân'),
(2, 'Trần Thị Lan'),
(3, 'Lê Hoàng Anh'),
(4, 'Phạm Quốc Bảo'),
(5, 'Đỗ Thị Hạnh'),
(6, 'Vũ Hữu Tài'),
(7, 'Hoàng Ngọc Mai');

-- =========================================================
-- BẢNG KHÁCH HÀNG
-- =========================================================
DROP TABLE IF EXISTS `KhachHang`;
CREATE TABLE `KhachHang` (
  `MaKhachHang` INT AUTO_INCREMENT PRIMARY KEY,
  `HoTen` VARCHAR(100) NOT NULL,
  `Email` VARCHAR(100) UNIQUE NOT NULL,
  `SoDienThoai` VARCHAR(15) NOT NULL,
  `NgaySinh` DATE NOT NULL,
  `GioiTinh` VARCHAR(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- (Dữ liệu demo sẽ được thêm sau qua giao diện đăng ký)

-- =========================================================
-- BẢNG TÀI KHOẢN
-- =========================================================
DROP TABLE IF EXISTS `TaiKhoan`;
CREATE TABLE `TaiKhoan` (
  `MaTaiKhoan` INT AUTO_INCREMENT PRIMARY KEY,
  `TaiKhoan` VARCHAR(100) UNIQUE NOT NULL, -- chính là Email đăng nhập
  `MatKhau` VARCHAR(255) NOT NULL,
  `NgayLap` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `PhanQuyen` ENUM('KhachHang','NhaCungCap','Admin') DEFAULT 'KhachHang',
  `TrangThai` ENUM('HoatDong','Khoa') DEFAULT 'HoatDong',
  `MaKhachHang` INT NULL,
  `MaAdmin` INT NULL,
  CONSTRAINT `fk_taikhoan_khachhang` FOREIGN KEY (`MaKhachHang`) REFERENCES `KhachHang`(`MaKhachHang`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_taikhoan_admin` FOREIGN KEY (`MaAdmin`) REFERENCES `Admin`(`MaAdmin`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Ví dụ tài khoản quản trị:
INSERT INTO `TaiKhoan` (`TaiKhoan`, `MatKhau`, `PhanQuyen`, `MaAdmin`)
VALUES
('admin1@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', 'Admin', 1),
('admin2@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', 'Admin', 2);

-- =========================================================
-- CÁC BẢNG KHÁC (KHÔNG ĐỔI CẤU TRÚC)
-- =========================================================

DROP TABLE IF EXISTS `Tinh`;
CREATE TABLE `Tinh` (
  `MaTinh` VARCHAR(5) PRIMARY KEY,
  `TenTinh` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Tinh` (`MaTinh`, `TenTinh`) VALUES
('T01', 'Hà Nội'),
('T02', 'Hồ Chí Minh'),
('T03', 'Đà Nẵng'),
('T04', 'Hải Phòng'),
('T05', 'Cần Thơ'),
('T06', 'Bình Dương'),
('T07', 'Khánh Hòa');

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `Xa`;
CREATE TABLE `Xa` (
  `MaXa` VARCHAR(5) PRIMARY KEY,
  `TenXa` VARCHAR(100) NOT NULL,
  `MaTinh` VARCHAR(5) NOT NULL,
  CONSTRAINT `fk_xa_tinh` FOREIGN KEY (`MaTinh`) REFERENCES `Tinh`(`MaTinh`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Xa` VALUES
('X01', 'Phường Hoàn Kiếm', 'T01'),
('X02', 'Phường Bến Nghé', 'T02'),
('X03', 'Phường Hải Châu', 'T03'),
('X04', 'Phường Hồng Bàng', 'T04'),
('X05', 'Phường Ninh Kiều', 'T05'),
('X06', 'Phường Dĩ An', 'T06'),
('X07', 'Phường Nha Trang', 'T07');

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `DiaChi`;
CREATE TABLE `DiaChi` (
  `MaDiaChi` VARCHAR(10) PRIMARY KEY,
  `ChiTiet` TEXT,
  `MaXa` VARCHAR(5) NOT NULL,
  CONSTRAINT `fk_diachi_xa` FOREIGN KEY (`MaXa`) REFERENCES `Xa`(`MaXa`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `DiaChi` VALUES
('DC001', '12 Lý Thường Kiệt', 'X01'),
('DC002', '45 Nguyễn Huệ', 'X02'),
('DC003', '78 Bạch Đằng', 'X03'),
('DC004', '90 Điện Biên Phủ', 'X04'),
('DC005', '21 Trần Phú', 'X05'),
('DC006', '10 Nguyễn Văn Tiết', 'X06'),
('DC007', '99 Hùng Vương', 'X07');

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `NhaCungCap`;
CREATE TABLE `NhaCungCap` (
  `MaNCC` INT AUTO_INCREMENT PRIMARY KEY,
  `TenNCC` VARCHAR(200) NOT NULL,
  `ThongTinThanhToan` VARCHAR(200),
  `LoaiHinh` VARCHAR(50),
  `GiayPhepKD` VARCHAR(100),
  `MaDiaChi` VARCHAR(10),
  CONSTRAINT `fk_ncc_diachi` FOREIGN KEY (`MaDiaChi`) REFERENCES `DiaChi`(`MaDiaChi`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `NhaCungCap` VALUES
(1, 'Khách sạn Hoàng Gia', 'Vietcombank - 0123456789', 'Khách sạn', 'GP01', 'DC001'),
(2, 'Resort Biển Xanh', 'Techcombank - 0234567890', 'Resort', 'GP02', 'DC002'),
(3, 'Hotel Central', 'ACB - 0345678901', 'Khách sạn', 'GP03', 'DC003'),
(4, 'Homestay Hòa Bình', 'MB Bank - 0456789012', 'Homestay', 'GP04', 'DC004'),
(5, 'Villa Đại Dương', 'Agribank - 0567890123', 'Villa', 'GP05', 'DC005'),
(6, 'Hotel Dĩ An', 'BIDV - 0678901234', 'Khách sạn', 'GP06', 'DC006'),
(7, 'Resort Nha Trang Bay', 'VPBank - 0789012345', 'Resort', 'GP07', 'DC007');

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `LoaiPhong`;
CREATE TABLE `LoaiPhong` (
  `MaLoai` INT AUTO_INCREMENT PRIMARY KEY,
  `TenLoai` VARCHAR(100) NOT NULL,
  `MoTa` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `LoaiPhong` VALUES
(1, 'Phòng đơn', 'Phòng cho 1 người, có giường đơn'),
(2, 'Phòng đôi', 'Phòng cho 2 người, có giường đôi'),
(3, 'Phòng VIP', 'Phòng cao cấp có tiện nghi đầy đủ'),
(4, 'Phòng gia đình', 'Phòng rộng cho 4 người'),
(5, 'Phòng tập thể', 'Phòng nhiều giường cho nhóm bạn'),
(6, 'Phòng hướng biển', 'Có view biển, ban công thoáng mát'),
(7, 'Phòng cao cấp', 'Phòng sang trọng, nội thất hiện đại');

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `Phong`;
CREATE TABLE `Phong` (
  `MaPhong` INT AUTO_INCREMENT PRIMARY KEY,
    `TenPhong` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Phòng xịn',
  `MaLoai` INT NOT NULL,
  `Gia` DOUBLE NOT NULL DEFAULT 0,
  `SucChua` INT DEFAULT 1,
  `TinhTrang` TINYINT DEFAULT 1,
  `HinhAnh` VARCHAR(255),
  `MaNhaCungCap` INT,
  CONSTRAINT `fk_phong_loai` FOREIGN KEY (`MaLoai`) REFERENCES `LoaiPhong`(`MaLoai`) ON UPDATE CASCADE,
  CONSTRAINT `fk_phong_ncc` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap`(`MaNCC`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Phong` VALUES
(1,"phòng xịn", 1, 500000, 1, 1, 'phongdon.jpg', 1),
(2,"phòng xịn", 2, 700000, 2, 1, 'phongdoi.jpg', 2),
(3,"phòng xịn", 3, 1200000, 2, 1, 'phongvip.jpg', 3),
(4,"phòng xịn", 4, 900000, 4, 1, 'phonggiadinh.jpg', 4),
(5,"phòng xịn", 5, 400000, 6, 1, 'phongtapthe.jpg', 5),
(6,"phòng xịn", 6, 1500000, 2, 1, 'phongbien.jpg', 6),
(7,"phòng xịn", 7, 1800000, 2, 1, 'phongcaocap.jpg', 7);

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `DonDatPhong`;
CREATE TABLE `DonDatPhong` (
  `MaDon` INT AUTO_INCREMENT PRIMARY KEY,
  `MaKhachHang` INT NOT NULL,
  `NgayDat` DATE,
  `TrangThai` TINYINT DEFAULT 0,
  `TongTien` DOUBLE DEFAULT 0,
  CONSTRAINT `fk_dondat_kh` FOREIGN KEY (`MaKhachHang`) REFERENCES `KhachHang`(`MaKhachHang`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `ChiTietDonDatPhong`;
CREATE TABLE `ChiTietDonDatPhong` (
  `MaCTDon` INT AUTO_INCREMENT PRIMARY KEY,
  `MaDon` INT NOT NULL,
  `MaPhong` INT NOT NULL,
  `Gia` DOUBLE,
  CONSTRAINT `fk_ctd_maDon` FOREIGN KEY (`MaDon`) REFERENCES `DonDatPhong`(`MaDon`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ctd_phong` FOREIGN KEY (`MaPhong`) REFERENCES `Phong`(`MaPhong`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `DanhGia`;
CREATE TABLE `DanhGia` (
  `MaDanhGia` INT AUTO_INCREMENT PRIMARY KEY,
  `MaKhachHang` INT,
  `MaPhong` INT,
  `NgayDang` DATE,
  `SoSao` TINYINT,
  `NoiDung` TEXT,
  `HinhAnh` VARCHAR(255),
  CONSTRAINT `fk_dg_kh` FOREIGN KEY (`MaKhachHang`) REFERENCES `KhachHang`(`MaKhachHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dg_phong` FOREIGN KEY (`MaPhong`) REFERENCES `Phong`(`MaPhong`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `PhanHoi`;
CREATE TABLE `PhanHoi` (
  `MaPh` VARCHAR(10) PRIMARY KEY,
  `NoiDung` TEXT,
  `NgayPh` DATE,
  `MaDanhGia` INT,
  `MaNhaCungCap` INT,
  CONSTRAINT `fk_phanhoi_danhgia` FOREIGN KEY (`MaDanhGia`) REFERENCES `DanhGia`(`MaDanhGia`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_phanhoi_ncc` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap`(`MaNCC`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------
DROP TABLE IF EXISTS `ThanhToan`;
CREATE TABLE `ThanhToan` (
  `MaThanhToan` INT AUTO_INCREMENT PRIMARY KEY,
  `MaDon` INT NOT NULL,
  `NgayTT` DATE,
  `SoTien` DOUBLE,
  CONSTRAINT `fk_thanhtoan_don` FOREIGN KEY (`MaDon`) REFERENCES `DonDatPhong`(`MaDon`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
