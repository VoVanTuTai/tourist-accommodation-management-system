-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 24, 2025 lúc 01:53 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

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
  `MaTaiKhoan` int(11) DEFAULT NULL,
  `HoTen` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `admin`
--

INSERT INTO `admin` (`MaAdmin`, `MaTaiKhoan`, `HoTen`) VALUES
(11, 14, 'Tran Trung');

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
(25, 48, 1, 100000),
(26, 49, 2, 1500000),
(27, 50, 3, 1000000),
(28, 51, 4, 500000),
(29, 52, 5, 700000),
(30, 53, 7, 700000),
(31, 54, 8, 1600000),
(32, 55, 9, 2200000),
(33, 58, 10, 100000),
(34, 59, 14, 2222222),
(35, 60, 19, 2000000),
(36, 61, 27, 500000),
(37, 62, 28, 100000),
(38, 63, 29, 1500000),
(39, 64, 30, 900000),
(40, 65, 31, 100000),
(41, 66, 33, 1800000),
(56, 67, 2, 700000),
(57, 68, 3, 700000),
(58, 69, 28, 1500000),
(59, 70, 32, 2200000),
(60, 71, 29, 700000),
(61, 72, 5, 900000),
(62, 56, 19, 1200000),
(63, 57, 31, 1500000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhgia`
--

CREATE TABLE `danhgia` (
  `MaDanhGia` int(11) NOT NULL,
  `MaKhachHang` int(11) DEFAULT NULL,
  `MaPhong` int(11) DEFAULT NULL,
  `MaDon` int(11) DEFAULT NULL,
  `NgayDang` date DEFAULT NULL,
  `SoSao` tinyint(4) DEFAULT NULL,
  `NoiDung` text DEFAULT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `danhgia`
--

INSERT INTO `danhgia` (`MaDanhGia`, `MaKhachHang`, `MaPhong`, `MaDon`, `NgayDang`, `SoSao`, `NoiDung`, `HinhAnh`) VALUES
(1, 1, 1, 48, '2025-10-06', 5, 'Phòng sạch sẽ, nhân viên thân thiện.', NULL),
(2, 2, 2, 49, '2025-10-07', 4, 'Ổn so với tầm giá.', NULL),
(4, 4, 4, 50, '2025-10-09', 4, 'Phù hợp gia đình.', NULL),
(5, 5, 5, 51, '2025-10-10', 3, 'Giá rẻ nhưng hơi ồn.', NULL),
(6, 6, 6, 52, '2025-10-11', 5, 'View biển cực đẹp.', 'rv6.jpg'),
(7, 7, 7, 55, '2025-10-12', 5, 'Dịch vụ tuyệt vời.', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhgia_cu`
--

CREATE TABLE `danhgia_cu` (
  `MaDanhGia` int(11) NOT NULL,
  `MaKhachHang` int(11) DEFAULT NULL,
  `MaPhong` int(11) DEFAULT NULL,
  `MaDon` int(11) DEFAULT NULL,
  `NgayDang` date DEFAULT NULL,
  `SoSao` tinyint(4) DEFAULT NULL,
  `NoiDung` text DEFAULT NULL,
  `HinhAnh` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `danhgia_cu`
--

INSERT INTO `danhgia_cu` (`MaDanhGia`, `MaKhachHang`, `MaPhong`, `MaDon`, `NgayDang`, `SoSao`, `NoiDung`, `HinhAnh`) VALUES
(1, 1, 1, 48, '2025-10-06', 5, 'Phòng sạch sẽ, nhân viên thân thiện.', NULL),
(2, 2, 2, 49, '2025-10-07', 4, 'Ổn so với tầm giá.', NULL),
(3, 3, 3, 0, '2025-10-08', 5, 'Rất tiện nghi và yên tĩnh.', 'rv3.jpg'),
(4, 4, 4, 50, '2025-10-09', 4, 'Phù hợp gia đình.', NULL),
(5, 5, 5, 51, '2025-10-10', 3, 'Giá rẻ nhưng hơi ồn.', NULL),
(6, 6, 6, 52, '2025-10-11', 5, 'View biển cực đẹp.', 'rv6.jpg'),
(7, 7, 7, 55, '2025-10-12', 5, 'Dịch vụ tuyệt vời.', NULL);

--
-- Bẫy `danhgia_cu`
--
DELIMITER $$
CREATE TRIGGER `tg_danhgia_delete` AFTER DELETE ON `danhgia_cu` FOR EACH ROW UPDATE phong
SET DanhGia = (
  SELECT IFNULL(AVG(SoSao), 0) FROM danhgia WHERE MaPhong = OLD.MaPhong
)
WHERE MaPhong = OLD.MaPhong
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tg_danhgia_insert` AFTER INSERT ON `danhgia_cu` FOR EACH ROW UPDATE phong
SET DanhGia = (
  SELECT AVG(SoSao) FROM danhgia WHERE MaPhong = NEW.MaPhong
)
WHERE MaPhong = NEW.MaPhong
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tg_danhgia_update` AFTER UPDATE ON `danhgia_cu` FOR EACH ROW UPDATE phong
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
  `MaDiaChi` int(11) NOT NULL,
  `ChiTiet` text DEFAULT NULL,
  `MaXa` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `diachi`
--

INSERT INTO `diachi` (`MaDiaChi`, `ChiTiet`, `MaXa`) VALUES
(1, '12 nhà mới', 'X04'),
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
(21, 'Ngay biển', 'X01'),
(23, '12 Nguyên Văn Bao', 'X02'),
(24, 'ddi', 'X02'),
(25, 'Số 11', 'X07'),
(26, 'rge', 'X08'),
(27, 'qdqwdwq', 'X01'),
(28, 'qưdpqwdmqmdqpw', 'X07'),
(29, 'qưdpqwdmqmdqpw', 'X07'),
(30, 'qưnosnoqwnokwqmkqm', 'X02'),
(31, '12 nhà mới', 'X03'),
(32, '12 nhà mới', 'X03'),
(33, '12 nhà mới', 'X03'),
(34, '12 nhà mới', 'X03'),
(35, '12 nhà mới', 'X03'),
(36, '12 nhà mới', 'X03');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dondatphong`
--

CREATE TABLE `dondatphong` (
  `MaDon` int(11) NOT NULL,
  `MaKhachHang` int(11) NOT NULL,
  `TenNguoiNhan` text NOT NULL,
  `SDTNguoiNhan` varchar(10) DEFAULT NULL,
  `NgayDat` date DEFAULT NULL,
  `NgayNhan` datetime NOT NULL DEFAULT current_timestamp(),
  `NgayTra` datetime NOT NULL DEFAULT current_timestamp(),
  `TrangThai` tinyint(4) DEFAULT 0,
  `TongTien` double DEFAULT 0,
  `LiDoHuy` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dondatphong`
--

INSERT INTO `dondatphong` (`MaDon`, `MaKhachHang`, `TenNguoiNhan`, `SDTNguoiNhan`, `NgayDat`, `NgayNhan`, `NgayTra`, `TrangThai`, `TongTien`, `LiDoHuy`) VALUES
(48, 1, 'Nguyễn Văn A', '0901000001', '2025-12-15', '2025-12-16 00:00:00', '2025-12-18 00:00:00', 1, 100000, NULL),
(49, 1, 'Nguyễn Văn A', '0901000001', '2025-11-08', '2025-11-10 00:00:00', '2025-11-12 00:00:00', 0, 1500000, NULL),
(50, 1, 'Nguyễn Văn A', '0901000001', '2025-12-24', '2025-01-25 00:00:00', '2025-01-25 00:00:00', 2, 1000000, NULL),
(51, 17, 'Nguyễn Văn A', '0901000001', '2025-12-07', '2025-12-09 00:00:00', '2025-12-10 00:00:00', 1, 500000, NULL),
(52, 2, 'Trần Thị B', '0901000002', '2025-11-22', '2025-11-22 00:00:00', '2025-11-23 00:00:00', 2, 700000, 'Khách hủy'),
(53, 2, 'Trần Thị B', '0901000002', '2025-12-14', '2025-01-17 00:00:00', '2025-01-18 00:00:00', 0, 700000, NULL),
(54, 7, 'Trần Thị B', '0901000002', '2025-10-26', '2026-10-28 00:00:00', '2026-10-29 00:00:00', 2, 1600000, 'Khách hủy'),
(55, 2, 'Trần Thị B', '0901000002', '2025-11-30', '2025-11-30 00:00:00', '2025-11-30 00:00:00', 3, 2200000, NULL),
(56, 3, 'Lê Văn C', '0901000003', '2025-11-14', '2025-11-15 00:00:00', '2025-11-16 00:00:00', 1, 1200000, NULL),
(57, 3, 'Lê Văn C', '0901000003', '2025-11-27', '2025-11-28 00:00:00', '2025-11-30 00:00:00', 0, 1500000, NULL),
(58, 3, 'Lê Văn C', '0901000003', '2025-12-09', '2025-12-29 00:00:00', '2025-12-31 00:00:00', 0, 100000, NULL),
(59, 3, 'Lê Văn C', '0901000003', '2025-12-09', '2025-12-10 00:00:00', '2025-12-12 00:00:00', 1, 2222222, NULL),
(60, 4, 'Phạm Thị D', '0901000004', '2025-11-05', '2025-11-06 00:00:00', '2025-11-07 00:00:00', 2, 2000000, NULL),
(61, 4, 'Phạm Thị D', '0901000004', '2025-12-23', '2025-12-28 00:00:00', '2025-12-29 00:00:00', 2, 500000, NULL),
(62, 17, 'Phạm Thị D', '0901000004', '2025-11-07', '2025-11-08 00:00:00', '2025-11-09 00:00:00', 0, 100000, 'Khách hủy'),
(63, 4, 'Phạm Thị D', '0901000004', '2025-11-19', '2025-12-31 00:00:00', '2026-01-11 00:00:00', 3, 1500000, NULL),
(64, 5, 'Hoàng Văn E', '0901000005', '2025-10-30', '2026-01-22 00:00:00', '2025-12-31 00:00:00', 2, 900000, NULL),
(65, 16, 'Hoàng Văn E', '0901000005', '2025-11-11', '2026-01-05 00:00:00', '2026-01-21 00:00:00', 2, 100000, 'Khách hủy'),
(66, 5, 'Hoàng Văn E', '0901000005', '2025-11-15', '2025-12-26 00:00:00', '2026-01-06 00:00:00', 3, 1800000, NULL),
(67, 5, 'Hoàng Văn E', '0901000005', '2025-12-09', '2025-12-30 00:00:00', '2026-01-04 00:00:00', 0, 700000, NULL),
(68, 6, 'Đỗ Thị F', '0901000006', '2025-11-22', '2026-01-06 00:00:00', '2026-01-17 00:00:00', 1, 700000, NULL),
(69, 16, 'Đỗ Thị F', '0901000006', '2025-12-20', '2025-12-29 00:00:00', '2026-01-16 00:00:00', 1, 1500000, NULL),
(70, 6, 'Đỗ Thị F', '0901000006', '2025-10-31', '2026-01-17 00:00:00', '2026-01-07 00:00:00', 0, 2200000, 'Khách hủy'),
(71, 6, 'Đỗ Thị F', '0901000006', '2025-10-28', '2025-12-25 00:00:00', '2026-01-10 00:00:00', 0, 700000, NULL),
(72, 7, 'Vũ Văn G', '0901000007', '2025-12-24', '2026-01-09 00:00:00', '2026-01-19 00:00:00', 1, 900000, 'Khách hủy'),
(73, 7, 'Vũ Văn G', '0901000007', '2025-10-27', '2025-12-24 00:00:00', '2026-01-01 00:00:00', 3, 400000, NULL),
(74, 7, 'Vũ Văn G', '0901000007', '2025-11-17', '2026-01-01 00:00:00', '2026-01-15 00:00:00', 1, 1230000, 'Khách hủy'),
(75, 7, 'Vũ Văn G', '0901000007', '2025-11-16', '2026-01-13 00:00:00', '2026-01-12 00:00:00', 1, 100000, NULL),
(76, 16, 'Tú Tài', '0318410003', '2025-12-02', '2026-01-16 00:00:00', '2026-01-19 00:00:00', 1, 1600000, NULL),
(77, 16, 'Tú Tài', '0318410003', '2025-12-13', '2026-01-18 00:00:00', '2026-01-18 00:00:00', 0, 2200000, NULL),
(78, 16, 'Tú Tài', '0318410003', '2025-12-15', '2026-01-04 00:00:00', '2026-01-07 00:00:00', 1, 100000, NULL),
(79, 16, 'Tú Tài', '0318410003', '2025-11-14', '2026-01-11 00:00:00', '2026-01-01 00:00:00', 1, 1600000, NULL),
(80, 17, 'Tuyền', '0123456789', '2025-12-07', '2025-12-24 00:00:00', '2026-01-04 00:00:00', 0, 400000, NULL),
(81, 17, 'Tuyền', '0123456789', '2025-12-21', '2025-12-30 00:00:00', '2026-01-25 00:00:00', 0, 1800000, 'Khách hủy'),
(82, 17, 'Tuyền', '0123456789', '2025-11-04', '2026-01-05 00:00:00', '2026-01-12 00:00:00', 0, 1000000, NULL),
(83, 17, 'Tuyền', '0123456789', '2025-12-06', '2026-01-10 00:00:00', '2026-01-24 00:00:00', 0, 1200000, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

CREATE TABLE `khachhang` (
  `MaKhachHang` int(11) NOT NULL,
  `MaTaiKhoan` int(11) DEFAULT NULL,
  `HoTen` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) NOT NULL,
  `NgaySinh` date NOT NULL,
  `GioiTinh` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`MaKhachHang`, `MaTaiKhoan`, `HoTen`, `Email`, `SoDienThoai`, `NgaySinh`, `GioiTinh`) VALUES
(1, 3, 'Nguyễn Văn A', 'kh1@example.com', '0901000001', '1995-01-15', 'Nam'),
(2, 13, 'Trần Thị B', 'kh2@example.com', '0901000002', '1996-02-20', 'Nữ'),
(3, 6, 'Lê Văn C', 'kh3@example.com', '0901000003', '1994-03-10', 'Nam'),
(4, 4, 'Phạm Thị D', 'kh4@example.com', '0901000004', '1993-04-22', 'Nữ'),
(5, 5, 'Hoàng Văn E', 'kh5@example.com', '0901000005', '1992-05-05', 'Nam'),
(6, 7, 'Đỗ Thị F', 'kh6@example.com', '0901000006', '1997-06-18', 'Nữ'),
(7, 8, 'Vũ Văn G', 'kh7@example.com', '0901000007', '1991-07-30', 'Nam'),
(16, 15, 'Tú Tài', 'tutai2@gmail.com', '0318410003', '1111-11-11', 'Nam'),
(17, 18, 'Tuyền', 'cobatuoc@gmail.com', '0123456789', '2025-10-16', 'Nữ');

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

CREATE TABLE `nhacungcap` (
  `MaNCC` int(11) NOT NULL,
  `MaTaiKhoan` int(11) DEFAULT NULL,
  `TenNCC` varchar(200) NOT NULL,
  `ThongTinThanhToan` varchar(200) DEFAULT NULL,
  `LoaiHinh` varchar(50) DEFAULT NULL,
  `GiayPhepKD` varchar(100) DEFAULT NULL,
  `TrangThai` enum('Chờ Duyệt','Đang hoạt động','Đã khóa') NOT NULL,
  `MaDiaChi` int(11) DEFAULT NULL,
  `LoaiNganHang` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhacungcap`
--

INSERT INTO `nhacungcap` (`MaNCC`, `MaTaiKhoan`, `TenNCC`, `ThongTinThanhToan`, `LoaiHinh`, `GiayPhepKD`, `TrangThai`, `MaDiaChi`, `LoaiNganHang`) VALUES
(1, 12, 'Khách sạn Hoàng Gia', '0123456789', 'Khách sạn', 'GP01', 'Đang hoạt động', 1, 'Vietcombank'),
(2, 11, 'Resort Biển Xanh', 'Techcombank - 0234567890', 'Resort', 'GP02', 'Đã khóa', 2, NULL),
(9, 9, 'Highland Retreat', 'Sacombank - 0901234567', 'Resort', 'GP09', 'Đang hoạt động', 9, NULL),
(10, 10, 'Lâm Đồng Villa', 'ACB - 0912345678', 'Villa', 'GP10', 'Đang hoạt động', 10, NULL),
(11, 17, 'hotel promax', '123456789', 'NhaNghi', '3000_secure_1.png', 'Chờ Duyệt', 23, 'VCB');

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
('PH003', 'Cảm ơn góp ý, chúng tôi sẽ cải thiện.', '2025-10-08', 3, NULL),
('PH004', 'Hân hạnh đón tiếp gia đình bạn.', '2025-10-09', 4, NULL),
('PH005', 'Xin lỗi về sự bất tiện, chúng tôi sẽ xử lý.', '2025-10-10', 5, NULL),
('PH006', 'Cảm ơn bạn đã yêu thích view biển.', '2025-10-11', 6, NULL),
('PH007', 'Rất cảm kích phản hồi tích cực.', '2025-10-12', 7, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phong`
--

CREATE TABLE `phong` (
  `MaPhong` int(11) NOT NULL,
  `TenPhong` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
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
-- Đang đổ dữ liệu cho bảng `phong`
--

INSERT INTO `phong` (`MaPhong`, `TenPhong`, `MaLoai`, `Gia`, `SucChua`, `TinhTrang`, `HinhAnh`, `MoTa`, `MaDiaChi`, `DanhGia`, `MaNhaCungCap`) VALUES
(1, 'Phòng 2 người', 7, 100000, 2, 2, '[\"images (1).jpg\",\"images (10).jpg\"]', 'mô tả mới sửa', 1, 5, 1),
(2, 'phòng xịn', 2, 700000, 2, 1, '[\"images (11).jpg\"]', NULL, 2, 4, 2),
(3, 'phòng xịn', 3, 1200000, 2, 1, '[\"images (12).jpg\"]', NULL, 3, 5, 9),
(4, 'phòng xịn', 4, 900000, 4, 1, '[\"images (13).jpg\"]', NULL, 4, 4, 10),
(5, 'phòng xịn', 5, 400000, 6, 1, '[\"images (14).jpg\"]', NULL, 5, 3, 11),
(6, 'phòng xịn', 6, 1500000, 2, 1, '[\"images (15).jpg\"]', NULL, 6, 5, 1),
(7, 'phòng xịn', 7, 1800000, 2, 1, '[\"images (16).jpg\"]', NULL, 7, 5, 2),
(8, 'phòng xịn', 8, 1600000, 2, 1, '[\"images (17).jpg\"]', NULL, 8, 5, 10),
(9, 'phòng xịn', 9, 2000000, 3, 1, '[\"images (18).jpg\"]', NULL, 9, 5, 9),
(10, 'phòng xịn', 10, 2200000, 2, 1, '[\"images (19).jpg\"]', NULL, 10, 5, 10),
(13, 'Phòng Deluxe Twin', 5, 800000, 2, 1, '[\"images (20).jpg\"]', NULL, 11, 5, 11),
(14, 'Phòng Suite Hạng Sang', 5, 1200000, 3, 1, '[\"images (2).jpg\"]', NULL, 12, 5, 1),
(19, 'Phòng mới 2', 6, 2222222, 2, 2, '[\"images (21).jpg\",\"images (22).jpg\"]', NULL, 20, 5, 2),
(22, 'Phòng mớ nhất', 7, 700000, 0, 2, '[\"images (22).jpg\"]', 'Mô tả cho phòng', 25, 5, 9),
(27, 'jqsdnwiqdww', 5, 1000000, 3, 0, '[\"images (23).jpg\",\"images (4).jpg\",\"images (7).jpg\"]', 'ưqoknxqoxwoqoqxnnoq', 30, 5, 11),
(28, 'phòng xịn 123122', 3, 500000, 1, 1, '[\"images (23).jpg\",\"images (21).jpg\",\"images (25).jpg\"]', 'scdfsaf', 31, 5, 1),
(29, 'phòng xịn 123122', 3, 100000, 1, 1, '[\"images (16).jpg\",\"images (3).jpg\",\"images (5).jpg\"]', 'scdfsaf', 32, 5, 2),
(30, 'phòng xịn 123122', 3, 100000, 1, 1, '[\"images (9).jpg\",\"images (8).jpg\",\"images (4).jpg\",\"images (26).jpg\",\"images (6).jpg\"]', 'scdfsaf', 33, 5, 9),
(31, 'phòng xịn 123122', 3, 1230000, 1, 1, '[\"images (26).jpg\"]', 'scdfsaf', 34, 5, 10),
(32, 'phòng xịn 123122', 3, 100000, 1, 1, '[\"images (28).jpg\"]', 'scdfsaf', 35, 5, 11),
(33, 'phòng xịn 123122', 3, 1500000, 1, 1, '[\"images (2).jpg\"]', 'scdfsaf', 36, 5, 1);

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
('GrBoanhcJJst6zpiUqhw0E2Es9DZLpG7', 1766666078, '{\"cookie\":{\"originalMaxAge\":false,\"expires\":false,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"user\":{\"MaTaiKhoan\":19,\"TaiKhoan\":\"admin@gmail.com\",\"PhanQuyen\":\"Admin\",\"TrangThai\":\"HoatDong\",\"HoTen\":\"\",\"SoDienThoai\":\"\"}}');

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
  `TrangThai` enum('HoatDong','Khoa','ChoDuyet') DEFAULT 'HoatDong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`MaTaiKhoan`, `TaiKhoan`, `MatKhau`, `NgayLap`, `PhanQuyen`, `TrangThai`) VALUES
(3, 'kh1@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(4, 'kh2@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(5, 'kh3@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(6, 'kh4@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(7, 'kh5@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(8, 'kh6@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(9, 'tvt@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'NhaCungCap', 'HoatDong'),
(10, 'acc@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'NhaCungCap', 'HoatDong'),
(11, 'abc123@gmail.com', '$2b$10$.j/ciBEvJN2lBN97REPI8uVvX.ZSmFakHE6rf/uAa5OtvARZZySty', '2025-10-21 05:52:30', 'NhaCungCap', 'HoatDong'),
(12, 'tutai@gmail.com', '$2b$10$Z2t9fzKHiZQZoUTsUPJY2uVo4xrCo06UWmCiwKHDuRC4zzV0IrRpm', '2025-10-22 00:00:04', 'NhaCungCap', 'HoatDong'),
(13, 'cc@gmail.com', '$2b$10$dFZzbNEdicLY.l42EMe/nO6XbZXDo2Bx9aYgxNQU8bYktAb..WEdu', '2025-10-23 09:35:32', 'KhachHang', 'Khoa'),
(14, 'trantrung1@gmail.com', '$2b$10$H6GBAUdMEDuBYwTmJpEXeeqVcOmCIDBk.nVnbtroneyFA6q74OAWi', '2025-10-30 08:11:17', 'Admin', 'HoatDong'),
(15, 'tutai2@gmail.com', '$2b$10$MbMsJQsA3xn.TP3.JbrWj.FKMynAW5W9rbESdjdWn7vEMFRlyIF22', '2025-10-30 08:40:24', 'KhachHang', 'HoatDong'),
(17, 'tuanvan@gmail.com', '$2b$10$wxbN7dnxX/uRK4q4XS2JxeJ42Z9EAbjy8179DxwRxA8GoILGFg.4C', '2025-10-30 08:45:04', 'NhaCungCap', 'ChoDuyet'),
(18, 'cobatuoc@gmail.com', '$2b$10$DNOXpTT8BbygAAsaV5tiWe2of3dQwo6kqMqMp0q.oWLSvtZQhqcgS', '2025-10-30 08:56:13', 'KhachHang', 'Khoa'),
(19, 'admin@gmail.com', '$2b$10$dt3KJ8/EM.zXG7Gh2DdeAeav9T1cBLZabTCJ7utRB1pApLlEgyULe', '2025-12-24 08:17:44', 'Admin', 'HoatDong');

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
(21, 48, '2025-12-18', 100000),
(22, 49, '2025-11-12', 1500000),
(23, 50, '2025-01-25', 1000000),
(24, 51, '2025-12-10', 500000),
(25, 53, '2025-01-18', 700000),
(26, 55, '2025-11-30', 2200000),
(27, 56, '2025-11-16', 1200000),
(28, 57, '2025-11-30', 1500000),
(29, 58, '2025-12-31', 100000),
(30, 59, '2025-12-12', 2222222),
(31, 60, '2025-11-07', 2000000),
(32, 61, '2025-12-29', 500000),
(33, 63, '2026-01-11', 1500000),
(34, 64, '2025-12-31', 900000),
(35, 66, '2026-01-06', 1800000),
(36, 67, '2026-01-04', 700000),
(37, 68, '2026-01-17', 700000),
(38, 69, '2026-01-16', 1500000),
(39, 71, '2026-01-10', 700000);

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
-- Cấu trúc đóng vai cho view `view_ncc_doanhthu`
-- (See below for the actual view)
--
CREATE TABLE `view_ncc_doanhthu` (
`MaNCC` int(11)
,`NAM` int(4)
,`THANG` int(2)
,`DOANHTHU` double
);

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `view_ncc_dondatphong`
-- (See below for the actual view)
--
CREATE TABLE `view_ncc_dondatphong` (
`MaNCC` int(11)
,`TRANGTHAI` tinyint(4)
,`SOLUONG` bigint(21)
);

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `view_ncc_phong`
-- (See below for the actual view)
--
CREATE TABLE `view_ncc_phong` (
`MaNCC` int(11)
,`LOAIPHONG` int(11)
,`TINHTRANG` tinyint(4)
,`SOLUONG` bigint(21)
);

-- --------------------------------------------------------

--
-- Cấu trúc đóng vai cho view `v_danhgia_hople`
-- (See below for the actual view)
--
CREATE TABLE `v_danhgia_hople` (
`MaDanhGia` int(11)
,`MaKhachHang` int(11)
,`MaPhong` int(11)
,`MaDon` int(11)
,`NgayDang` date
,`SoSao` tinyint(4)
,`NoiDung` text
,`HinhAnh` varchar(255)
);

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

-- --------------------------------------------------------

--
-- Cấu trúc cho view `view_ncc_doanhthu`
--
DROP TABLE IF EXISTS `view_ncc_doanhthu`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_ncc_doanhthu`  AS SELECT `n`.`MaNCC` AS `MaNCC`, year(`d`.`NgayDat`) AS `NAM`, month(`d`.`NgayDat`) AS `THANG`, sum(`d`.`TongTien`) AS `DOANHTHU` FROM (((`dondatphong` `d` left join `chitietdondatphong` `c` on(`d`.`MaDon` = `c`.`MaDon`)) left join `phong` `p` on(`c`.`MaPhong` = `p`.`MaPhong`)) left join `nhacungcap` `n` on(`p`.`MaNhaCungCap` = `n`.`MaNCC`)) WHERE `d`.`TrangThai` = 2 GROUP BY `n`.`MaNCC`, year(`d`.`NgayDat`), month(`d`.`NgayDat`) ;

-- --------------------------------------------------------

--
-- Cấu trúc cho view `view_ncc_dondatphong`
--
DROP TABLE IF EXISTS `view_ncc_dondatphong`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_ncc_dondatphong`  AS SELECT `n`.`MaNCC` AS `MaNCC`, `d`.`TrangThai` AS `TRANGTHAI`, count(`d`.`MaDon`) AS `SOLUONG` FROM (((`dondatphong` `d` left join `chitietdondatphong` `c` on(`d`.`MaDon` = `c`.`MaDon`)) left join `phong` `p` on(`c`.`MaPhong` = `p`.`MaPhong`)) left join `nhacungcap` `n` on(`p`.`MaNhaCungCap` = `n`.`MaNCC`)) GROUP BY `n`.`MaNCC`, `d`.`TrangThai` ;

-- --------------------------------------------------------

--
-- Cấu trúc cho view `view_ncc_phong`
--
DROP TABLE IF EXISTS `view_ncc_phong`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_ncc_phong`  AS SELECT `n`.`MaNCC` AS `MaNCC`, `p`.`MaLoai` AS `LOAIPHONG`, `p`.`TinhTrang` AS `TINHTRANG`, count(`p`.`MaPhong`) AS `SOLUONG` FROM (`phong` `p` left join `nhacungcap` `n` on(`p`.`MaNhaCungCap` = `n`.`MaNCC`)) GROUP BY `n`.`MaNCC`, `p`.`MaLoai`, `p`.`TinhTrang` ;

-- --------------------------------------------------------

--
-- Cấu trúc cho view `v_danhgia_hople`
--
DROP TABLE IF EXISTS `v_danhgia_hople`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_danhgia_hople`  AS SELECT `dg`.`MaDanhGia` AS `MaDanhGia`, `dg`.`MaKhachHang` AS `MaKhachHang`, `dg`.`MaPhong` AS `MaPhong`, `dg`.`MaDon` AS `MaDon`, `dg`.`NgayDang` AS `NgayDang`, `dg`.`SoSao` AS `SoSao`, `dg`.`NoiDung` AS `NoiDung`, `dg`.`HinhAnh` AS `HinhAnh` FROM (`danhgia` `dg` join `dondatphong` `d` on(`dg`.`MaDon` = `d`.`MaDon`)) ;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`MaAdmin`),
  ADD KEY `fk_admin_taikhoan` (`MaTaiKhoan`);

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
  ADD KEY `fk_dg_phong` (`MaPhong`),
  ADD KEY `fk_danhgia_dondatphong_moi` (`MaDon`);

--
-- Chỉ mục cho bảng `danhgia_cu`
--
ALTER TABLE `danhgia_cu`
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
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `fk_khachhang_taikhoan` (`MaTaiKhoan`);

--
-- Chỉ mục cho bảng `loaiphong`
--
ALTER TABLE `loaiphong`
  ADD PRIMARY KEY (`MaLoai`);

--
-- Chỉ mục cho bảng `nhacungcap`
--
ALTER TABLE `nhacungcap`
  ADD PRIMARY KEY (`MaNCC`),
  ADD KEY `fk_ncc_diachi` (`MaDiaChi`),
  ADD KEY `fk_nhacungcap_taikhoan` (`MaTaiKhoan`);

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
  ADD UNIQUE KEY `TaiKhoan` (`TaiKhoan`);

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
  MODIFY `MaAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `chitietdondatphong`
--
ALTER TABLE `chitietdondatphong`
  MODIFY `MaCTDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  MODIFY `MaDanhGia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `danhgia_cu`
--
ALTER TABLE `danhgia_cu`
  MODIFY `MaDanhGia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `diachi`
--
ALTER TABLE `diachi`
  MODIFY `MaDiaChi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `dondatphong`
--
ALTER TABLE `dondatphong`
  MODIFY `MaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `MaKhachHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `loaiphong`
--
ALTER TABLE `loaiphong`
  MODIFY `MaLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `nhacungcap`
--
ALTER TABLE `nhacungcap`
  MODIFY `MaNCC` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `phong`
--
ALTER TABLE `phong`
  MODIFY `MaPhong` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `MaTaiKhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  MODIFY `MaThanhToan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `fk_admin_taikhoan` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`) ON DELETE SET NULL ON UPDATE CASCADE;

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
  ADD CONSTRAINT `fk_danhgia_dondatphong` FOREIGN KEY (`MaDon`) REFERENCES `dondatphong` (`MaDon`),
  ADD CONSTRAINT `fk_danhgia_dondatphong_moi` FOREIGN KEY (`MaDon`) REFERENCES `dondatphong` (`MaDon`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `danhgia_cu`
--
ALTER TABLE `danhgia_cu`
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
  ADD CONSTRAINT `fk_dondatphong_khachhang` FOREIGN KEY (`MaKhachHang`) REFERENCES `khachhang` (`MaKhachHang`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  ADD CONSTRAINT `fk_khachhang_taikhoan` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `nhacungcap`
--
ALTER TABLE `nhacungcap`
  ADD CONSTRAINT `fk_ncc_diachi` FOREIGN KEY (`MaDiaChi`) REFERENCES `diachi` (`MaDiaChi`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nhacungcap_taikhoan` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phanhoi`
--
ALTER TABLE `phanhoi`
  ADD CONSTRAINT `fk_phanhoi_danhgia` FOREIGN KEY (`MaDanhGia`) REFERENCES `danhgia_cu` (`MaDanhGia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phanhoi_ncc` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `nhacungcap` (`MaNCC`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phong`
--
ALTER TABLE `phong`
  ADD CONSTRAINT `fk_phong_loai` FOREIGN KEY (`MaLoai`) REFERENCES `loaiphong` (`MaLoai`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_phong_ncc` FOREIGN KEY (`MaNhaCungCap`) REFERENCES `nhacungcap` (`MaNCC`) ON DELETE SET NULL ON UPDATE CASCADE;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
