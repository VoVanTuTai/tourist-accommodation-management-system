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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admin`
--

CREATE TABLE `admin` (
  `MaAdmin` int(11) NOT NULL,
  `HoTen` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `admin`
--

INSERT INTO `admin` (`MaAdmin`, `HoTen`) VALUES
(1, 'Nguyễn Minh Quân'),
(2, 'Trần Thị Lan'),
(3, 'Lê Hoàng Anh'),
(4, 'Phạm Quốc Bảo'),
(5, 'Đỗ Thị Hạnh'),
(6, 'Vũ Hữu Tài'),
(7, 'Hoàng Ngọc Mai'),
(8, 'Ngô Thanh Bình'),
(9, 'Bùi Nhật Minh'),
(10, 'Phan Thu Hà');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietdondatphong`
--

CREATE TABLE `chitietdondatphong` (
  `MaCTDon` int(11) NOT NULL,
  `MaDon` int(11) NOT NULL,
  `MaPhong` int(11) NOT NULL,
  `Gia` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietdondatphong`
--

INSERT INTO `chitietdondatphong` (`MaCTDon`, `MaDon`, `MaPhong`, `Gia`) VALUES
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
-- Cấu trúc bảng cho bảng `danhgia`
--

CREATE TABLE `danhgia` (
  `MaDanhGia` int(11) NOT NULL,
  `MaKhachHang` int(11) DEFAULT NULL,
  `MaPhong` int(11) DEFAULT NULL,
  `NgayDang` date DEFAULT NULL,
  `SoSao` tinyint(4) DEFAULT NULL,
  `NoiDung` text DEFAULT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `danhgia`
--

INSERT INTO `danhgia` (`MaDanhGia`, `MaKhachHang`, `MaPhong`, `NgayDang`, `SoSao`, `NoiDung`, `HinhAnh`) VALUES
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
-- Bẫy `danhgia`
--
DELIMITER $$
CREATE TRIGGER `tg_danhgia_delete` AFTER DELETE ON `danhgia` FOR EACH ROW UPDATE phong
SET DanhGia = (
  SELECT IFNULL(AVG(SoSao), 0) FROM danhgia WHERE MaPhong = OLD.MaPhong
)
WHERE MaPhong = OLD.MaPhong
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tg_danhgia_insert` AFTER INSERT ON `danhgia` FOR EACH ROW UPDATE phong
SET DanhGia = (
  SELECT AVG(SoSao) FROM danhgia WHERE MaPhong = NEW.MaPhong
)
WHERE MaPhong = NEW.MaPhong
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tg_danhgia_update` AFTER UPDATE ON `danhgia` FOR EACH ROW UPDATE phong
SET DanhGia = (
  SELECT AVG(SoSao) FROM danhgia WHERE MaPhong = NEW.MaPhong
)
WHERE MaPhong = NEW.MaPhong
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `diachi`
--

CREATE TABLE `diachi` (
  `MaDiaChi` varchar(10) NOT NULL,
  `ChiTiet` text DEFAULT NULL,
  `MaXa` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `diachi`
--

INSERT INTO `diachi` (`MaDiaChi`, `ChiTiet`, `MaXa`) VALUES
('DC001', '12 Lý Thường Kiệt', 'X01'),
('DC002', '45 Nguyễn Huệ', 'X02'),
('DC003', '78 Bạch Đằng', 'X03'),
('DC004', '90 Điện Biên Phủ', 'X04'),
('DC005', '21 Trần Phú', 'X05'),
('DC006', '10 Nguyễn Văn Tiết', 'X06'),
('DC007', '99 Hùng Vương', 'X07'),
('DC008', '15 Trương Công Định', 'X08'),
('DC009', '22 Nguyễn Tất Thành', 'X09'),
('DC010', '7 Đinh Tiên Hoàng', 'X10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dondatphong`
--

CREATE TABLE `dondatphong` (
  `MaDon` int(11) NOT NULL,
  `MaKhachHang` int(11) NOT NULL,
  `NgayDat` date DEFAULT NULL,
  `NgayNhan` date NOT NULL DEFAULT current_timestamp(),
  `NgayTra` date NOT NULL DEFAULT current_timestamp(),
  `TrangThai` tinyint(4) DEFAULT 0,
  `TongTien` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dondatphong`
--

INSERT INTO `dondatphong` (`MaDon`, `MaKhachHang`, `NgayDat`, `NgayNhan`, `NgayTra`, `TrangThai`, `TongTien`) VALUES
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
-- Cấu trúc bảng cho bảng `khachhang`
--

CREATE TABLE `khachhang` (
  `MaKhachHang` int(11) NOT NULL,
  `HoTen` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) NOT NULL,
  `NgaySinh` date NOT NULL,
  `GioiTinh` varchar(10) NOT NULL,
  `TrangThai` enum('Hoạt động bình thường','Đã khóa') NOT NULL DEFAULT 'Hoạt động bình thường'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`MaKhachHang`, `HoTen`, `Email`, `SoDienThoai`, `NgaySinh`, `GioiTinh`, `TrangThai`) VALUES
(1, 'Nguyễn Văn A', 'kh1@example.com', '0901000001', '1995-01-15', 'Nam', 'Hoạt động bình thường'),
(2, 'Trần Thị B', 'kh2@example.com', '0901000002', '1996-02-20', 'Nữ', 'Hoạt động bình thường'),
(3, 'Lê Văn C', 'kh3@example.com', '0901000003', '1994-03-10', 'Nam', 'Hoạt động bình thường'),
(4, 'Phạm Thị D', 'kh4@example.com', '0901000004', '1993-04-22', 'Nữ', 'Hoạt động bình thường'),
(5, 'Hoàng Văn E', 'kh5@example.com', '0901000005', '1992-05-05', 'Nam', 'Hoạt động bình thường'),
(6, 'Đỗ Thị F', 'kh6@example.com', '0901000006', '1997-06-18', 'Nữ', 'Hoạt động bình thường'),
(7, 'Vũ Văn G', 'kh7@example.com', '0901000007', '1991-07-30', 'Nam', 'Hoạt động bình thường'),
(8, 'Bùi Thị H', 'kh8@example.com', '0901000008', '1998-08-12', 'Nữ', 'Hoạt động bình thường'),
(9, 'Phan Văn I', 'kh9@example.com', '0901000009', '1990-09-25', 'Nam', 'Hoạt động bình thường'),
(10, 'Đặng Thị K', 'kh10@example.com', '0901000010', '1999-10-08', 'Nữ', 'Hoạt động bình thường'),
(11, 'Tuyền', 'abc123@gmail.com', '0123456780', '2025-10-01', 'Nam', 'Hoạt động bình thường');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loaiphong`
--

CREATE TABLE `loaiphong` (
  `MaLoai` int(11) NOT NULL,
  `TenLoai` varchar(100) NOT NULL,
  `MoTa` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `loaiphong`
--

INSERT INTO `loaiphong` (`MaLoai`, `TenLoai`, `MoTa`) VALUES
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
-- Cấu trúc bảng cho bảng `nhacungcap`
--

CREATE TABLE `NhaCungCap` (
  `MaNCC` int(11) NOT NULL,
  `TenNCC` varchar(200) NOT NULL,
  `ThongTinThanhToan` varchar(200) DEFAULT NULL,
  `LoaiHinh` varchar(50) DEFAULT NULL,
  `GiayPhepKD` varchar(100) DEFAULT NULL,
  `TrangThai` enum('Chờ Duyệt','Đang hoạt động','Đã khóa') NOT NULL,
  `MaDiaChi` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhacungcap`
--

INSERT INTO `NhaCungCap` (`MaNCC`, `TenNCC`, `ThongTinThanhToan`, `LoaiHinh`, `GiayPhepKD`, `TrangThai`, `MaDiaChi`) VALUES
(1, 'Khách sạn Hoàng Gia', 'Vietcombank - 0123456789', 'Khách sạn', 'GP01', 'Đang hoạt động', 'DC001'),
(2, 'Resort Biển Xanh', 'Techcombank - 0234567890', 'Resort', 'GP02', 'Đã khóa', 'DC002'),
(3, 'Hotel Central', 'ACB - 0345678901', 'Khách sạn', 'GP03', 'Đã khóa', 'DC003'),
(4, 'Homestay Hòa Bình', 'MB Bank - 0456789012', 'Homestay', 'GP04', 'Đang hoạt động', 'DC004'),
(5, 'Villa Đại Dương', 'Agribank - 0567890123', 'Villa', 'GP05', 'Đang hoạt động', 'DC005'),
(6, 'Hotel Dĩ An', 'BIDV - 0678901234', 'Khách sạn', 'GP06', 'Đã khóa', 'DC006'),
(7, 'Resort Nha Trang Bay', 'VPBank - 0789012345', 'Resort', 'GP07', 'Chờ Duyệt', 'DC007'),
(8, 'Sunrise Hotel', 'VietinBank - 0890123456', 'Khách sạn', 'GP08', 'Chờ Duyệt', 'DC008'),
(9, 'Highland Retreat', 'Sacombank - 0901234567', 'Resort', 'GP09', 'Đang hoạt động', 'DC009'),
(10, 'Lâm Đồng Villa', 'ACB - 0912345678', 'Villa', 'GP10', 'Đang hoạt động', 'DC010');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phanhoi`
--

CREATE TABLE `phanhoi` (
  `MaPh` varchar(10) NOT NULL,
  `NoiDung` text DEFAULT NULL,
  `NgayPh` date DEFAULT NULL,
  `MaDanhGia` int(11) DEFAULT NULL,
  `MaNhaCungCap` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phanhoi`
--

INSERT INTO `phanhoi` (`MaPh`, `NoiDung`, `NgayPh`, `MaDanhGia`, `MaNhaCungCap`) VALUES
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
-- Cấu trúc bảng cho bảng `phong`
--

CREATE TABLE `phong` (
  `MaPhong` int(11) NOT NULL,
  `TenPhong` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Phòng xịn',
  `MaLoai` int(11) NOT NULL,
  `Gia` double NOT NULL DEFAULT 0,
  `SucChua` int(11) DEFAULT 1,
  `TinhTrang` tinyint(4) DEFAULT 1,
  `HinhAnh` varchar(255) DEFAULT NULL,
  `MaDiaChi` varchar(10) NOT NULL,
  `DanhGia` float NOT NULL DEFAULT 5,
  `MaNhaCungCap` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phong`
--

INSERT INTO `phong` (`MaPhong`, `TenPhong`, `MaLoai`, `Gia`, `SucChua`, `TinhTrang`, `HinhAnh`, `MaDiaChi`, `DanhGia`, `MaNhaCungCap`) VALUES
(1, 'phòng xịn', 1, 500000, 1, 1, 'phongdon.jpg', 'DC001', 3, 1),
(2, 'phòng xịn', 2, 700000, 2, 1, 'phongdoi.jpg', 'DC002', 5, 2),
(3, 'phòng xịn', 3, 1200000, 2, 1, 'phongvip.jpg', 'DC003', 5, 3),
(4, 'phòng xịn', 4, 900000, 4, 1, 'phonggiadinh.jpg', 'DC004', 5, 4),
(5, 'phòng xịn', 5, 400000, 6, 1, 'phongtapthe.jpg', 'DC005', 5, 5),
(6, 'phòng xịn', 6, 1500000, 2, 1, 'phongbien.jpg', 'DC006', 5, 6),
(7, 'phòng xịn', 7, 1800000, 2, 1, 'phongcaocap.jpg', 'DC007', 5, 7),
(8, 'phòng xịn', 8, 1600000, 2, 1, 'suite.jpg', 'DC008', 5, 8),
(9, 'phòng xịn', 9, 2000000, 3, 1, 'bungalow.jpg', 'DC009', 5, 9),
(10, 'phòng xịn', 10, 2200000, 2, 1, 'penthouse.jpg', 'DC010', 5, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('sess_0001', 1893456000, '{\"user\":\"1\"}'),
('sess_0002', 1893456000, '{\"user\":\"2\"}'),
('sess_0003', 1893456000, '{\"user\":\"3\"}'),
('sess_0004', 1893456000, '{\"user\":\"4\"}'),
('sess_0005', 1893456000, '{\"user\":\"5\"}'),
('sess_0006', 1893456000, '{\"user\":\"6\"}'),
('sess_0007', 1893456000, '{\"user\":\"7\"}'),
('sess_0008', 1893456000, '{\"user\":\"8\"}'),
('sess_0009', 1893456000, '{\"user\":\"9\"}'),
('sess_0010', 1893456000, '{\"user\":\"10\"}');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `MaTaiKhoan` int(11) NOT NULL,
  `TaiKhoan` varchar(100) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `NgayLap` timestamp NOT NULL DEFAULT current_timestamp(),
  `PhanQuyen` enum('KhachHang','NhaCungCap','Admin') DEFAULT 'KhachHang',
  `TrangThai` enum('HoatDong','Khoa') DEFAULT 'HoatDong',
  `MaKhachHang` int(11) DEFAULT NULL,
  `MaAdmin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`MaTaiKhoan`, `TaiKhoan`, `MatKhau`, `NgayLap`, `PhanQuyen`, `TrangThai`, `MaKhachHang`, `MaAdmin`) VALUES
(1, 'admin1@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:02:19', 'Admin', 'HoatDong', NULL, 1),
(2, 'admin2@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:02:19', 'Admin', 'HoatDong', NULL, 2),
(3, 'kh1@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong', 1, NULL),
(4, 'kh2@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong', 2, NULL),
(5, 'kh3@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong', 3, NULL),
(6, 'kh4@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong', 4, NULL),
(7, 'kh5@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong', 5, NULL),
(8, 'kh6@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong', 6, NULL),
(9, 'kh7@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong', 7, NULL),
(10, 'kh8@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong', 8, NULL),
(11, 'abc123@gmail.com', '$2b$10$.j/ciBEvJN2lBN97REPI8uVvX.ZSmFakHE6rf/uAa5OtvARZZySty', '2025-10-21 05:52:30', 'KhachHang', 'HoatDong', 11, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thanhtoan`
--

CREATE TABLE `thanhtoan` (
  `MaThanhToan` int(11) NOT NULL,
  `MaDon` int(11) NOT NULL,
  `NgayTT` date DEFAULT NULL,
  `SoTien` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `thanhtoan`
--

INSERT INTO `thanhtoan` (`MaThanhToan`, `MaDon`, `NgayTT`, `SoTien`) VALUES
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
-- Cấu trúc bảng cho bảng `tinh`
--

CREATE TABLE `tinh` (
  `MaTinh` varchar(5) NOT NULL,
  `TenTinh` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tinh`
--

INSERT INTO `tinh` (`MaTinh`, `TenTinh`) VALUES
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
-- Cấu trúc bảng cho bảng `xa`
--

CREATE TABLE `xa` (
  `MaXa` varchar(5) NOT NULL,
  `TenXa` varchar(100) NOT NULL,
  `MaTinh` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `xa`
--

INSERT INTO `xa` (`MaXa`, `TenXa`, `MaTinh`) VALUES
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
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`MaAdmin`);

--
-- Chỉ mục cho bảng `chitietdondatphong`
--
ALTER TABLE `chitietdondatphong`
  ADD PRIMARY KEY (`MaCTDon`),
  ADD KEY `fk_ctd_maDon` (`MaDon`),
  ADD KEY `fk_ctd_phong` (`MaPhong`);

--
-- Chỉ mục cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  ADD PRIMARY KEY (`MaDanhGia`),
  ADD KEY `fk_dg_kh` (`MaKhachHang`),
  ADD KEY `fk_dg_phong` (`MaPhong`);

--
-- Chỉ mục cho bảng `diachi`
--
ALTER TABLE `diachi`
  ADD PRIMARY KEY (`MaDiaChi`),
  ADD KEY `fk_diachi_xa` (`MaXa`);

--
-- Chỉ mục cho bảng `dondatphong`
--
ALTER TABLE `dondatphong`
  ADD PRIMARY KEY (`MaDon`),
  ADD KEY `fk_dondat_kh` (`MaKhachHang`);

--
-- Chỉ mục cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`MaKhachHang`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Chỉ mục cho bảng `loaiphong`
--
ALTER TABLE `loaiphong`
  ADD PRIMARY KEY (`MaLoai`);

--
-- Chỉ mục cho bảng `nhacungcap`
--
ALTER TABLE `NhaCungCap`
  ADD PRIMARY KEY (`MaNCC`),
  ADD KEY `fk_ncc_diachi` (`MaDiaChi`);

--
-- Chỉ mục cho bảng `phanhoi`
--
ALTER TABLE `phanhoi`
  ADD PRIMARY KEY (`MaPh`),
  ADD KEY `fk_phanhoi_danhgia` (`MaDanhGia`),
  ADD KEY `fk_phanhoi_ncc` (`MaNhaCungCap`);

--
-- Chỉ mục cho bảng `phong`
--
ALTER TABLE `phong`
  ADD PRIMARY KEY (`MaPhong`),
  ADD KEY `fk_phong_loai` (`MaLoai`),
  ADD KEY `fk_phong_ncc` (`MaNhaCungCap`),
  ADD KEY `MaDiaChi` (`MaDiaChi`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`MaTaiKhoan`),
  ADD UNIQUE KEY `TaiKhoan` (`TaiKhoan`),
  ADD KEY `fk_taikhoan_khachhang` (`MaKhachHang`),
  ADD KEY `fk_taikhoan_admin` (`MaAdmin`);

--
-- Chỉ mục cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD PRIMARY KEY (`MaThanhToan`),
  ADD KEY `fk_thanhtoan_don` (`MaDon`);

--
-- Chỉ mục cho bảng `tinh`
--
ALTER TABLE `tinh`
  ADD PRIMARY KEY (`MaTinh`);

--
-- Chỉ mục cho bảng `xa`
--
ALTER TABLE `xa`
  ADD PRIMARY KEY (`MaXa`),
  ADD KEY `fk_xa_tinh` (`MaTinh`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `admin`
--
ALTER TABLE `admin`
  MODIFY `MaAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `chitietdondatphong`
--
ALTER TABLE `chitietdondatphong`
  MODIFY `MaCTDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  MODIFY `MaDanhGia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `dondatphong`
--
ALTER TABLE `dondatphong`
  MODIFY `MaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `MaKhachHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `loaiphong`
--
ALTER TABLE `loaiphong`
  MODIFY `MaLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `NhaCungCap`
--
ALTER TABLE `NhaCungCap`
  MODIFY `MaNCC` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `phong`
--
ALTER TABLE `phong`
  MODIFY `MaPhong` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `MaTaiKhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  MODIFY `MaThanhToan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chitietdondatphong`
--
ALTER TABLE `chitietdondatphong`
  ADD CONSTRAINT `fk_ctd_maDon` FOREIGN KEY (`MaDon`) REFERENCES `dondatphong` (`MaDon`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctd_phong` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `fk_dg_kh` FOREIGN KEY (`MaKhachHang`) REFERENCES `khachhang` (`MaKhachHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dg_phong` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `diachi`
--
ALTER TABLE `diachi`
  ADD CONSTRAINT `fk_diachi_xa` FOREIGN KEY (`MaXa`) REFERENCES `xa` (`MaXa`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `dondatphong`
--
ALTER TABLE `dondatphong`
  ADD CONSTRAINT `fk_dondat_kh` FOREIGN KEY (`MaKhachHang`) REFERENCES `khachhang` (`MaKhachHang`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `NhaCungCap`
--
ALTER TABLE `NhaCungCap`
  ADD CONSTRAINT `fk_ncc_diachi` FOREIGN KEY (`MaDiaChi`) REFERENCES `diachi` (`MaDiaChi`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phanhoi`
--
ALTER TABLE `phanhoi`
  ADD CONSTRAINT `fk_phanhoi_danhgia` FOREIGN KEY (`MaDanhGia`) REFERENCES `danhgia` (`MaDanhGia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phanhoi_ncc` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNCC`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phong`
--
ALTER TABLE `phong`
  ADD CONSTRAINT `fk_phong_diachi` FOREIGN KEY (`MaDiaChi`) REFERENCES `diachi` (`MaDiaChi`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phong_loai` FOREIGN KEY (`MaLoai`) REFERENCES `loaiphong` (`MaLoai`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phong_ncc` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNCC`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `fk_taikhoan_admin` FOREIGN KEY (`MaAdmin`) REFERENCES `admin` (`MaAdmin`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_taikhoan_khachhang` FOREIGN KEY (`MaKhachHang`) REFERENCES `khachhang` (`MaKhachHang`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD CONSTRAINT `fk_thanhtoan_don` FOREIGN KEY (`MaDon`) REFERENCES `dondatphong` (`MaDon`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `xa`
--
ALTER TABLE `xa`
  ADD CONSTRAINT `fk_xa_tinh` FOREIGN KEY (`MaTinh`) REFERENCES `tinh` (`MaTinh`) ON UPDATE CASCADE;

-- Thêm column MaNhaCungCap vao Table TaiKhoan
alter table TaiKhoan 
add column MaNhaCungCap int(11) DEFAULT NULL;

-- Thêm foreign key
alter table TaiKhoan 
ADD CONSTRAINT `fk_taikhoan_nhacungcap` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `NhaCungCap` (`MaNCC`) ON DELETE SET NULL ON UPDATE CASCADE;


-- Thêm TrangThai ChoDuyet vao column TrangThai table TaiKhoan
alter table TaiKhoan 
MODIFY COLUMN TrangThai ENUM('ChoDuyet', 'HoatDong', 'Khoa') default 'HoatDong';

-- Thêm column LoaiNganHang vào Table NhaCungCap
ALTER TABLE NhaCungCap ADD COLUMN LoaiNganHang VARCHAR(255);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
