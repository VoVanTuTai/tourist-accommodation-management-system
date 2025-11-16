-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 21, 2025 lúc 04:34 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `quanlidatphong`
--
CREATE DATABASE quanlidatphong
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;
-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Admin`
--

CREATE TABLE `Admin` (
  `MaAdmin` int(11) NOT NULL,
  `MaTaiKhoan` int(11) DEFAULT NULL,
  `HoTen` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `Admin`
--

INSERT INTO `Admin` (`MaAdmin`, `MaTaiKhoan`, `HoTen`) VALUES
(1, NULL, 'Admin');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `LoaiPhong`
--

CREATE TABLE `LoaiPhong` (
  `MaLoai` int(11) NOT NULL,
  `TenLoai` varchar(100) NOT NULL,
  `MoTa` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `LoaiPhong`
--

INSERT INTO `LoaiPhong` (`MaLoai`, `TenLoai`, `MoTa`) VALUES
(1, 'Phòng đơn', 'Phòng cho 1 người, có giường đơn'),
(2, 'Phòng đôi', 'Phòng cho 2 người, có giường đôi'),
(3, 'Phòng VIP', 'Phòng cao cấp có tiện nghi đầy đủ'),
(4, 'Phòng gia đình', 'Phòng rộng cho 4 người'),
(5, 'Phòng tập thể', 'Phòng nhiều giường cho nhóm bạn'),
(6, 'Phòng hướng biển', 'Có view biển, ban công thoáng mát'),
(7, 'Phòng cao cấp', 'Phòng sang trọng, nội thất hiện đại'),
(8, 'Suite Hạng Sang', 'Phòng suite cao cấp, có phòng khách riêng'),
(9, 'Bungalow', 'Nhà gỗ riêng biệt, vườn riêng'),
(10, 'Penthouse', 'Căn hộ áp mái, tầm nhìn toàn cảnh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Tinh`
--

CREATE TABLE `Tinh` (
  `MaTinh` varchar(5) NOT NULL,
  `TenTinh` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `Tinh`
--

INSERT INTO `Tinh` (`MaTinh`, `TenTinh`) VALUES
('T01', 'Hà Nội'),
('T02', 'Hồ Chí Minh'),
('T03', 'Đà Nẵng'),
('T04', 'Hải Phòng'),
('T05', 'Cần Thơ'),
('T06', 'Bình Dương'),
('T07', 'Khánh Hòa'),
('T08', 'Bà Rịa - Vũng Tàu'),
('T09', 'Đắk Lắk'),
('T10', 'Lâm Đồng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Xa`
--

CREATE TABLE `Xa` (
  `MaXa` varchar(5) NOT NULL,
  `TenXa` varchar(100) NOT NULL,
  `MaTinh` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `Xa`
--

INSERT INTO `Xa` (`MaXa`, `TenXa`, `MaTinh`) VALUES
('X01', 'Phường Hoàn Kiếm', 'T01'),
('X02', 'Phường Bến Nghé', 'T02'),
('X03', 'Phường Hải Châu', 'T03'),
('X04', 'Phường Hồng Bàng', 'T04'),
('X05', 'Phường Ninh Kiều', 'T05'),
('X06', 'Phường Dĩ An', 'T06'),
('X07', 'Phường Nha Trang', 'T07'),
('X08', 'Phường Thắng Tam', 'T08'),
('X09', 'Phường Tân Lập', 'T09'),
('X10', 'Phường 9', 'T10');

--
-- Cấu trúc bảng cho bảng `DiaChi`
--

CREATE TABLE `DiaChi` (
  `MaDiaChi` int(11) NOT NULL,
  `ChiTiet` text DEFAULT NULL,
  `MaXa` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `DiaChi`
--

INSERT INTO `DiaChi` (`MaDiaChi`, `ChiTiet`, `MaXa`) VALUES
(1, '12 nhà mới', 'X07'),
(2, '12 Lý Thường Kiệt', 'X01'),
(3, '45 Nguyễn Huệ', 'X02'),
(4, '78 Bạch Đằng', 'X03'),
(5, '90 Điện Biên Phủ', 'X04'),
(6, '21 Trần Phú', 'X05'),
(7, '10 Nguyễn Văn Tiết', 'X06'),
(8, '99 Hùng Vương', 'X07'),
(9, '15 Trương Công Định', 'X08'),
(10, '22 Nguyễn Tất Thành', 'X09'),
(11, '7 Đinh Tiên Hoàng', 'X10'),
(13, '12 phường nào đó', 'X01'),
(14, '12 phường nào đó', 'X01'),
(15, '12 phường nào đó', 'X01'),
(16, '12 phường nào đó', 'X01'),
(17, 'Địa chỉ cũng mới', 'X02'),
(18, 'địa chỉ cụ thể', 'X02'),
(19, 'Chỗ đó đó', 'X01'),
(20, 'Ngay biển', 'X01'),
(21, 'Ngay biển', 'X01');
-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `TaiKhoan`
--

CREATE TABLE `TaiKhoan` (
  `MaTaiKhoan` int(11) NOT NULL,
  `TaiKhoan` varchar(100) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `NgayLap` timestamp NOT NULL DEFAULT current_timestamp(),
  `PhanQuyen` enum('KhachHang','NhaCungCap','Admin') DEFAULT 'KhachHang',
  `TrangThai` enum('HoatDong','Khoa') DEFAULT 'HoatDong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `TaiKhoan`
--

INSERT INTO `TaiKhoan` (`MaTaiKhoan`, `TaiKhoan`, `MatKhau`, `NgayLap`, `PhanQuyen`, `TrangThai`) VALUES
(1, 'admin1@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:02:19', 'Admin', 'HoatDong'),
(2, 'admin2@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:02:19', 'Admin', 'HoatDong'),
(3, 'kh1@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(4, 'kh2@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(5, 'kh3@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(6, 'kh4@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(7, 'kh5@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(8, 'kh6@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(9, 'kh7@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(10, 'kh8@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(11, 'abc123@gmail.com', '$2b$10$.j/ciBEvJN2lBN97REPI8uVvX.ZSmFakHE6rf/uAa5OtvARZZySty', '2025-10-21 05:52:30', 'KhachHang', 'HoatDong'),
(12, 'tutai@gmail.com', '$2b$10$Z2t9fzKHiZQZoUTsUPJY2uVo4xrCo06UWmCiwKHDuRC4zzV0IrRpm', '2025-10-22 00:00:04', 'NhaCungCap', 'HoatDong'),
(13, 'cc@gmail.com', '$2b$10$dFZzbNEdicLY.l42EMe/nO6XbZXDo2Bx9aYgxNQU8bYktAb..WEdu', '2025-10-23 09:35:32', 'KhachHang', 'Khoa');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `KhachHang`
--

CREATE TABLE `KhachHang` (
  `MaKhachHang` int(11) NOT NULL,
  `MaTaiKhoan` int(11) DEFAULT NULL,
  `HoTen` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) NOT NULL,
  `NgaySinh` date NOT NULL,
  `GioiTinh` varchar(10) NOT NULL,
  `TrangThai` enum('Hoạt động bình thường','Đã khóa') NOT NULL DEFAULT 'Hoạt động bình thường'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `KhachHang`
--

INSERT INTO `KhachHang` (`MaKhachHang`, `MaTaiKhoan`, `HoTen`, `Email`, `SoDienThoai`, `NgaySinh`, `GioiTinh`, `TrangThai`) VALUES
(1, NULL, 'Nguyễn Văn A', 'kh1@example.com', '0901000001', '1995-01-15', 'Nam', 'Hoạt động bình thường'),
(2, NULL, 'Trần Thị B', 'kh2@example.com', '0901000002', '1996-02-20', 'Nữ', 'Hoạt động bình thường'),
(3, NULL, 'Lê Văn C', 'kh3@example.com', '0901000003', '1994-03-10', 'Nam', 'Hoạt động bình thường'),
(4, NULL, 'Phạm Thị D', 'kh4@example.com', '0901000004', '1993-04-22', 'Nữ', 'Hoạt động bình thường'),
(5, NULL, 'Hoàng Văn E', 'kh5@example.com', '0901000005', '1992-05-05', 'Nam', 'Hoạt động bình thường'),
(6, NULL, 'Đỗ Thị F', 'kh6@example.com', '0901000006', '1997-06-18', 'Nữ', 'Hoạt động bình thường'),
(7, NULL, 'Vũ Văn G', 'kh7@example.com', '0901000007', '1991-07-30', 'Nam', 'Hoạt động bình thường'),
(8, NULL, 'Bùi Thị H', 'kh8@example.com', '0901000008', '1998-08-12', 'Nữ', 'Hoạt động bình thường'),
(9, NULL, 'Phan Văn I', 'kh9@example.com', '0901000009', '1990-09-25', 'Nam', 'Hoạt động bình thường'),
(10, NULL, 'Đặng Thị K', 'kh10@example.com', '0901000010', '1999-10-08', 'Nữ', 'Hoạt động bình thường'),
(11, NULL, 'Tuyền', 'abc123@gmail.com', '0123456780', '2025-10-01', 'Nam', 'Hoạt động bình thường'),
(12, 12, 'Tú Tài', 'tutai@gmail.com', '0909090909', '1111-01-01', 'Khác', 'Hoạt động bình thường'),
(13, NULL, 'Tuyn', 'cc@gmail.com', '0123456789', '2025-10-01', 'Nam', 'Hoạt động bình thường'),
(14, NULL, 'ngườ mới', 'nguoimoi@gmail.com', '0123481901', '1111-11-11', 'Nam', 'Hoạt động bình thường');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `NhaCungCap`
--

CREATE TABLE `NhaCungCap` (
  `MaNCC` int(11) NOT NULL,
  `MaTaiKhoan` int(11) DEFAULT NULL,
  `TenNCC` varchar(200) NOT NULL,
  `ThongTinThanhToan` varchar(200) DEFAULT NULL,
  `LoaiHinh` varchar(50) DEFAULT NULL,
  `GiayPhepKD` varchar(100) DEFAULT NULL,
  `MaDiaChi` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `NhaCungCap`
--

INSERT INTO `NhaCungCap` (`MaNCC`, `MaTaiKhoan`, `TenNCC`, `ThongTinThanhToan`, `LoaiHinh`, `GiayPhepKD`, `TrangThai`, `MaDiaChi`) VALUES
(1, 1, 'Khách sạn Hoàng Gia', 'Vietcombank - 0123456789', 'Khách sạn', 'GP01', 'Đang hoạt động', 1),
(2, 2, 'Resort Biển Xanh', 'Techcombank - 0234567890', 'Resort', 'GP02', 'Đã khóa', 2),
(3, 3, 'Hotel Central', 'ACB - 0345678901', 'Khách sạn', 'GP03', 'Đã khóa', 4),
(4, 4, 'Homestay Hòa Bình', 'MB Bank - 0456789012', 'Homestay', 'GP04', 'Đang hoạt động', 3),
(5, 5, 'Villa Đại Dương', 'Agribank - 0567890123', 'Villa', 'GP05', 'Đang hoạt động', 5),
(6, 6, 'Hotel Dĩ An', 'BIDV - 0678901234', 'Khách sạn', 'GP06', 'Đã khóa', 6),
(7, 7, 'Resort Nha Trang Bay', 'VPBank - 0789012345', 'Resort', 'GP07', 'Chờ Duyệt', 7),
(8, 8, 'Sunrise Hotel', 'VietinBank - 0890123456', 'Khách sạn', 'GP08', 'Chờ Duyệt', 8),
(9, 9, 'Highland Retreat', 'Sacombank - 0901234567', 'Resort', 'GP09', 'Đang hoạt động', 9),
(10, 10, 'Lâm Đồng Villa', 'ACB - 0912345678', 'Villa', 'GP10', 'Đang hoạt động', 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Phong`
--

CREATE TABLE `Phong` (
  `MaPhong` int(11) NOT NULL,
  `TenPhong` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Phòng xịn',
  `MaLoai` int(11) NOT NULL,
  `Gia` double NOT NULL DEFAULT 0,
  `SucChua` int(11) DEFAULT 1,
  `TinhTrang` tinyint(4) DEFAULT 1,
  `HinhAnh` varchar(255) DEFAULT NULL,
  `MoTa` text DEFAULT NULL,
  `MaDiaChi` int(10) UNSIGNED DEFAULT NULL,
  `DanhGia` float NOT NULL DEFAULT 5,
  `MaNhaCungCap` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `Phong`
--

INSERT INTO `Phong` (`MaPhong`, `TenPhong`, `MaLoai`, `Gia`, `SucChua`, `TinhTrang`, `HinhAnh`, `MoTa`, `MaDiaChi`, `DanhGia`, `MaNhaCungCap`) VALUES
(1, 'phòng xịn 123122', 1, 500000, 1, 2, 'unnamed.jpg', 'Mô tả hay ho cho phòng một', 1, 3, 1),
(2, 'phòng xịn', 2, 700000, 2, 1, 'unnamed.jpg', NULL, 2, 5, 2),
(3, 'phòng xịn', 3, 1200000, 2, 1, 'unnamed.jpg', NULL, 3, 5, 3),
(4, 'phòng xịn', 4, 900000, 4, 1, 'unnamed.jpg', NULL, 4, 5, 4),
(5, 'phòng xịn', 5, 400000, 6, 1, 'unnamed.jpg', NULL, 5, 4, 5),
(6, 'phòng xịn', 6, 1500000, 2, 1, 'unnamed.jpg', NULL, 6, 5, 6),
(7, 'phòng xịn', 7, 1800000, 2, 1, 'unnamed.jpg', NULL, 7, 5, 7),
(8, 'phòng xịn', 8, 1600000, 2, 1, 'unnamed.jpg', NULL, 8, 5, 8),
(9, 'phòng xịn', 9, 2000000, 3, 1, 'unnamed.jpg', NULL, 9, 5, 9),
(10, 'phòng xịn', 10, 2200000, 2, 1, 'unnamed.jpg', NULL, 10, 5, 10),
(13, 'Phòng Deluxe Twin', 5, 800000, 2, 1, 'unnamed.jpg', NULL, 11, 5, 5),
(14, 'Phòng Suite Hạng Sang', 5, 1200000, 3, 1, 'unnamed.jpg', NULL, 12, 5, 5),
(18, 'Phòng mới', 3, 2, 2, 2, '1761677397680-52885761-1732203190878.jpg', NULL, 19, 5, 1),
(19, 'Phòng mới 2', 6, 22222222, 2, 1, '1761677582773-175316728-1732203190878.jpg', NULL, 20, 5, 1),
(20, 'Phòng mới 3', 6, 22222221, 2, 0, '1761677619876-951692049-1732203190878.jpg', 'Phòng ngay biển luôn nhé', 21, 5, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ChiTietDonDatPhong`
--

CREATE TABLE `ChiTietDonDatPhong` (
  `MaCTDon` int(11) NOT NULL,
  `MaDon` int(11) NOT NULL,
  `MaPhong` int(11) NOT NULL,
  `Gia` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ChiTietDonDatPhong`
--

INSERT INTO `ChiTietDonDatPhong` (`MaCTDon`, `MaDon`, `MaPhong`, `Gia`) VALUES
(1, 1, 1, 500000),
(2, 2, 2, 700000),
(3, 3, 3, 1200000),
(4, 4, 4, 900000),
(5, 5, 5, 400000),
(6, 6, 6, 1500000),
(7, 7, 7, 1800000),
(8, 8, 8, 1600000),
(9, 9, 9, 2000000),
(10, 10, 10, 2200000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `DanhGia`
--

CREATE TABLE `DanhGia` (
  `MaDanhGia` int(11) NOT NULL,
  `MaKhachHang` int(11) DEFAULT NULL,
  `MaPhong` int(11) DEFAULT NULL,
  `NgayDang` date DEFAULT NULL,
  `SoSao` tinyint(4) DEFAULT NULL,
  `NoiDung` text DEFAULT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `DanhGia`
--

INSERT INTO `DanhGia` (`MaDanhGia`, `MaKhachHang`, `MaPhong`, `NgayDang`, `SoSao`, `NoiDung`, `HinhAnh`) VALUES
(1, 1, 1, '2025-10-06', 5, 'Phòng sạch sẽ, nhân viên thân thiện.', NULL),
(2, 2, 2, '2025-10-07', 4, 'Ổn so với tầm giá.', NULL),
(3, 3, 3, '2025-10-08', 5, 'Rất tiện nghi và yên tĩnh.', 'rv3.jpg'),
(4, 4, 4, '2025-10-09', 4, 'Phù hợp gia đình.', NULL),
(5, 5, 5, '2025-10-10', 3, 'Giá rẻ nhưng hơi ồn.', NULL),
(6, 6, 6, '2025-10-11', 5, 'View biển cực đẹp.', 'rv6.jpg'),
(7, 7, 7, '2025-10-12', 5, 'Dịch vụ tuyệt vời.', NULL),
(8, 8, 8, '2025-10-13', 4, 'Suite rộng rãi, sang trọng.', 'rv8.jpg'),
(9, 9, 9, '2025-10-14', 4, 'Bungalow ấm cúng.', NULL),
(10, 10, 10, '2025-10-15', 5, 'Penthouse đỉnh cao!', 'rv10.jpg'),
(11, 8, 1, '2025-10-08', 1, 'CŨng tạm', NULL);

--
-- Cấu trúc bảng cho bảng `DonDatPhong`
--

CREATE TABLE `DonDatPhong` (
  `MaDon` int(11) NOT NULL,
  `MaKhachHang` int(11) NOT NULL,
  `NgayDat` date DEFAULT NULL,
  `NgayNhan` datetime NOT NULL DEFAULT current_timestamp(),
  `NgayTra` datetime NOT NULL DEFAULT current_timestamp(),
  `TrangThai` tinyint(4) DEFAULT 0,
  `TongTien` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `DonDatPhong`
--

INSERT INTO `DonDatPhong` (`MaDon`, `MaKhachHang`, `NgayDat`, `NgayNhan`, `NgayTra`, `TrangThai`, `TongTien`) VALUES
(1, 1, '2025-10-01', '2025-10-05', '2025-10-06', 1, 500000),
(2, 2, '2025-10-02', '2025-10-06', '2025-10-07', 1, 700000),
(3, 3, '2025-10-03', '2025-10-07', '2025-10-08', 1, 1200000),
(4, 4, '2025-10-04', '2025-10-08', '2025-10-09', 1, 900000),
(5, 5, '2025-10-05', '2025-10-09', '2025-10-10', 1, 400000),
(6, 6, '2025-10-06', '2025-10-10', '2025-10-11', 1, 1500000),
(7, 7, '2025-10-07', '2025-10-11', '2025-10-12', 1, 1800000),
(8, 8, '2025-10-08', '2025-10-12', '2025-10-13', 1, 1600000),
(9, 9, '2025-10-09', '2025-10-13', '2025-10-14', 1, 2000000),
(10, 10, '2025-10-10', '2025-10-14', '2025-10-15', 1, 2200000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `PhanHoi`
--

CREATE TABLE `PhanHoi` (
  `MaPh` varchar(10) NOT NULL,
  `NoiDung` text DEFAULT NULL,
  `NgayPh` date DEFAULT NULL,
  `MaDanhGia` int(11) DEFAULT NULL,
  `MaNhaCungCap` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `PhanHoi`
--

INSERT INTO `PhanHoi` (`MaPh`, `NoiDung`, `NgayPh`, `MaDanhGia`, `MaNhaCungCap`) VALUES
('PH001', 'Cảm ơn bạn đã đánh giá!', '2025-10-06', 1, 1),
('PH002', 'Rất vui được phục vụ bạn.', '2025-10-07', 2, 2),
('PH003', 'Cảm ơn góp ý, chúng tôi sẽ cải thiện.', '2025-10-08', 3, 3),
('PH004', 'Hân hạnh đón tiếp gia đình bạn.', '2025-10-09', 4, 4),
('PH005', 'Xin lỗi về sự bất tiện, chúng tôi sẽ xử lý.', '2025-10-10', 5, 5),
('PH006', 'Cảm ơn bạn đã yêu thích view biển.', '2025-10-11', 6, 6),
('PH007', 'Rất cảm kích phản hồi tích cực.', '2025-10-12', 7, 7),
('PH008', 'Cảm ơn, mong được gặp lại bạn.', '2025-10-13', 8, 8),
('PH009', 'Trân trọng phản hồi của bạn.', '2025-10-14', 9, 9),
('PH010', 'Xin cảm ơn và hẹn gặp lại.', '2025-10-15', 10, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Sessions`
--

CREATE TABLE `Sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `Sessions`
--

INSERT INTO `Sessions` (`session_id`, `expires`, `data`) VALUES
('Q17h-s6Sui06f9XL02YxON5AeyMYiTtT', 1761728373, '{\"cookie\":{\"originalMaxAge\":false,\"expires\":false,\"httpOnly\":true,\"path\":\"/\"},\"ncc\":{\"MaNCC\":1,\"TenNCC\":\"Khách sạn Hoàng Gia\",\"Email\":\"hoanggia@example.com\"},\"user\":{\"MaTaiKhoan\":12,\"TaiKhoan\":\"tutai@gmail.com\",\"PhanQuyen\":\"NhaCungCap\",\"TrangThai\":\"HoatDong\"}}'),
('sess_0001', 1893456000, '{\"user\":\"1\"}'),
('sess_0002', 1893456000, '{\"user\":\"2\"}'),
('sess_0003', 1893456000, '{\"user\":\"3\"}'),
('sess_0004', 1893456000, '{\"user\":\"4\"}'),
('sess_0005', 1893456000, '{\"user\":\"5\"}'),
('sess_0006', 1893456000, '{\"user\":\"6\"}'),
('sess_0007', 1893456000, '{\"user\":\"7\"}'),
('sess_0008', 1893456000, '{\"user\":\"8\"}'),
('sess_0009', 1893456000, '{\"user\":\"9\"}'),
('sess_0010', 1893456000, '{\"user\":\"10\"}'),
('w2Okv7MN8rw1H_8QucOUXBPbsqlMhAHw', 1761765925, '{\"cookie\":{\"originalMaxAge\":false,\"expires\":false,\"httpOnly\":true,\"path\":\"/\"},\"ncc\":{\"MaNCC\":1,\"TenNCC\":\"Khách sạn Hoàng Gia\",\"Email\":\"hoanggia@example.com\"},\"user\":{\"MaTaiKhoan\":12,\"TaiKhoan\":\"tutai@gmail.com\",\"PhanQuyen\":\"NhaCungCap\",\"TrangThai\":\"HoatDong\"}}');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ThanhToan`
--

CREATE TABLE `ThanhToan` (
  `MaThanhToan` int(11) NOT NULL,
  `MaDon` int(11) NOT NULL,
  `NgayTT` date DEFAULT NULL,
  `SoTien` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ThanhToan`
--

INSERT INTO `ThanhToan` (`MaThanhToan`, `MaDon`, `NgayTT`, `SoTien`) VALUES
(1, 1, '2025-10-06', 500000),
(2, 2, '2025-10-07', 700000),
(3, 3, '2025-10-08', 1200000),
(4, 4, '2025-10-09', 900000),
(5, 5, '2025-10-10', 400000),
(6, 6, '2025-10-11', 1500000),
(7, 7, '2025-10-12', 1800000),
(8, 8, '2025-10-13', 1600000),
(9, 9, '2025-10-14', 2000000),
(10, 10, '2025-10-15', 2200000);

-- --------------------------------------------------------

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`MaAdmin`),
  ADD KEY `fk_admin_taikhoan` (`MaTaiKhoan`);

--
-- Chỉ mục cho bảng `ChiTietDonDatPhong`
--
ALTER TABLE `ChiTietDonDatPhong`
  ADD PRIMARY KEY (`MaCTDon`),
  ADD KEY `fk_ctd_maDon` (`MaDon`),
  ADD KEY `fk_ctd_phong` (`MaPhong`);

--
-- Chỉ mục cho bảng `DanhGia`
--
ALTER TABLE `DanhGia`
  ADD PRIMARY KEY (`MaDanhGia`),
  ADD KEY `fk_dg_kh` (`MaKhachHang`),
  ADD KEY `fk_dg_phong` (`MaPhong`);

--
-- Chỉ mục cho bảng `DiaChi`
--
ALTER TABLE `DiaChi`
  ADD PRIMARY KEY (`MaDiaChi`),
  ADD KEY `fk_diachi_xa` (`MaXa`);

--
-- Chỉ mục cho bảng `DonDatPhong`
--
ALTER TABLE `DonDatPhong`
  ADD PRIMARY KEY (`MaDon`),
  ADD KEY `fk_dondat_kh` (`MaKhachHang`);

--
-- Chỉ mục cho bảng `KhachHang`
--
ALTER TABLE `KhachHang`
  ADD PRIMARY KEY (`MaKhachHang`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `fk_khachhang_taikhoan` (`MaTaiKhoan`);

--
-- Chỉ mục cho bảng `LoaiPhong`
--
ALTER TABLE `LoaiPhong`
  ADD PRIMARY KEY (`MaLoai`);

--
-- Chỉ mục cho bảng `NhaCungCap`
--
ALTER TABLE `NhaCungCap`
  ADD PRIMARY KEY (`MaNCC`),
  ADD KEY `fk_ncc_diachi` (`MaDiaChi`),
  ADD KEY `fk_nhacungcap_taikhoan` (`MaTaiKhoan`);

--
-- Chỉ mục cho bảng `PhanHoi`
--
ALTER TABLE `PhanHoi`
  ADD PRIMARY KEY (`MaPh`),
  ADD KEY `fk_phanhoi_danhgia` (`MaDanhGia`),
  ADD KEY `fk_phanhoi_ncc` (`MaNhaCungCap`);

--
-- Chỉ mục cho bảng `Phong`
--
ALTER TABLE `Phong`
  ADD PRIMARY KEY (`MaPhong`),
  ADD KEY `fk_phong_loai` (`MaLoai`),
  ADD KEY `fk_phong_ncc` (`MaNhaCungCap`),
  ADD KEY `MaDiaChi` (`MaDiaChi`);

--
-- Chỉ mục cho bảng `Sessions`
--
ALTER TABLE `Sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Chỉ mục cho bảng `TaiKhoan`
--
ALTER TABLE `TaiKhoan`
  ADD PRIMARY KEY (`MaTaiKhoan`),
  ADD UNIQUE KEY `TaiKhoan` (`TaiKhoan`);

--
-- Chỉ mục cho bảng `ThanhToan`
--
ALTER TABLE `ThanhToan`
  ADD PRIMARY KEY (`MaThanhToan`),
  ADD KEY `fk_thanhtoan_don` (`MaDon`);

--
-- Chỉ mục cho bảng `Tinh`
--
ALTER TABLE `Tinh`
  ADD PRIMARY KEY (`MaTinh`);

--
-- Chỉ mục cho bảng `Xa`
--
ALTER TABLE `Xa`
  ADD PRIMARY KEY (`MaXa`),
  ADD KEY `fk_xa_tinh` (`MaTinh`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `Admin`
--
ALTER TABLE `Admin`
  MODIFY `MaAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `ChiTietDonDatPhong`
--
ALTER TABLE `ChiTietDonDatPhong`
  MODIFY `MaCTDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `DanhGia`
--
ALTER TABLE `DanhGia`
  MODIFY `MaDanhGia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `DiaChi`
--
ALTER TABLE `DiaChi`
  MODIFY `MaDiaChi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `DonDatPhong`
--
ALTER TABLE `DonDatPhong`
  MODIFY `MaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `KhachHang`
--
ALTER TABLE `KhachHang`
  MODIFY `MaKhachHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `LoaiPhong`
--
ALTER TABLE `LoaiPhong`
  MODIFY `MaLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `NhaCungCap`
--
ALTER TABLE `NhaCungCap`
  MODIFY `MaNCC` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `Phong`
--
ALTER TABLE `Phong`
  MODIFY `MaPhong` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `TaiKhoan`
--
ALTER TABLE `TaiKhoan`
  MODIFY `MaTaiKhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `ThanhToan`
--
ALTER TABLE `ThanhToan`
  MODIFY `MaThanhToan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--


--
-- Các ràng buộc cho bảng `Admin`
--
ALTER TABLE `Admin`
  ADD CONSTRAINT `fk_admin_taikhoan` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `TaiKhoan` (`MaTaiKhoan`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `ChiTietDonDatPhong`
--
ALTER TABLE `ChiTietDonDatPhong`
  ADD CONSTRAINT `fk_ctd_maDon` FOREIGN KEY (`MaDon`) REFERENCES `DonDatPhong` (`MaDon`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctd_phong` FOREIGN KEY (`MaPhong`) REFERENCES `Phong` (`MaPhong`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `DanhGia`
--
ALTER TABLE `DanhGia`
  ADD CONSTRAINT `fk_dg_kh` FOREIGN KEY (`MaKhachHang`) REFERENCES `KhachHang` (`MaKhachHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dg_phong` FOREIGN KEY (`MaPhong`) REFERENCES `Phong` (`MaPhong`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `DiaChi`
--
ALTER TABLE `DiaChi`
  ADD CONSTRAINT `fk_diachi_xa` FOREIGN KEY (`MaXa`) REFERENCES `Xa` (`MaXa`) ON UPDATE CASCADE;


--
-- Các ràng buộc cho bảng `KhachHang`
--
ALTER TABLE `KhachHang`
  ADD CONSTRAINT `fk_khachhang_taikhoan` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `TaiKhoan` (`MaTaiKhoan`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `NhaCungCap`
--
ALTER TABLE `NhaCungCap`
  ADD CONSTRAINT `fk_ncc_diachi` FOREIGN KEY (`MaDiaChi`) REFERENCES `DiaChi` (`MaDiaChi`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nhacungcap_taikhoan` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `TaiKhoan` (`MaTaiKhoan`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `PhanHoi`
--
ALTER TABLE `PhanHoi`
  ADD CONSTRAINT `fk_phanhoi_danhgia` FOREIGN KEY (`MaDanhGia`) REFERENCES `DanhGia` (`MaDanhGia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phanhoi_ncc` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNCC`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `Phong`
--
ALTER TABLE `Phong`
  ADD CONSTRAINT `fk_phong_loai` FOREIGN KEY (`MaLoai`) REFERENCES `LoaiPhong` (`MaLoai`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phong_ncc` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNCC`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `ThanhToan`
--
ALTER TABLE `ThanhToan`
  ADD CONSTRAINT `fk_thanhtoan_don` FOREIGN KEY (`MaDon`) REFERENCES `DonDatPhong` (`MaDon`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `Xa`
--
ALTER TABLE `Xa`
  ADD CONSTRAINT `fk_xa_tinh` FOREIGN KEY (`MaTinh`) REFERENCES `Tinh` (`MaTinh`) ON UPDATE CASCADE;


-- Thêm TrangThai ChoDuyet vao column TrangThai table TaiKhoan
alter table TaiKhoan 
MODIFY COLUMN TrangThai ENUM('ChoDuyet', 'HoatDong', 'Khoa') default 'HoatDong';

-- Thêm column LoaiNganHang vào Table NhaCungCap
ALTER TABLE NhaCungCap ADD COLUMN LoaiNganHang VARCHAR(255);

-- Thêm column MoTa vào Table Phong
-- ALTER TABLE Phong ADD COLUMN MoTa text;

--
-- Bẫy `DanhGia`
--
DELIMITER $$
CREATE TRIGGER `tg_danhgia_delete` AFTER DELETE ON `DanhGia` FOR EACH ROW UPDATE Phong
SET DanhGia = (
  SELECT IFNULL(AVG(SoSao), 0) FROM DanhGia WHERE MaPhong = OLD.MaPhong
)
WHERE MaPhong = OLD.MaPhong
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tg_danhgia_insert` AFTER INSERT ON `DanhGia` FOR EACH ROW UPDATE Phong
SET DanhGia = (
  SELECT AVG(SoSao) FROM DanhGia WHERE MaPhong = NEW.MaPhong
)
WHERE MaPhong = NEW.MaPhong
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tg_danhgia_update` AFTER UPDATE ON `DanhGia` FOR EACH ROW UPDATE Phong
SET DanhGia = (
  SELECT AVG(SoSao) FROM DanhGia WHERE MaPhong = NEW.MaPhong
)
WHERE MaPhong = NEW.MaPhong
$$
DELIMITER ;

-- --------------------------------------------------------
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
