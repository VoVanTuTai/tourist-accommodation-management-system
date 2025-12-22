-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 06, 2025 lúc 07:18 AM
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
(16, 11, 27, 1200000),
(17, 12, 28, 1800000),
(18, 13, 29, 950000),
(19, 14, 33, 1350000),
(20, 15, 32, 2100000);

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
(11, 8, 1, '2025-10-08', 1, 'CŨng tạm', NULL),
(12, 12, 3, '2025-10-22', 5, 'Phòng đẹp quá ', NULL),
(13, 12, 5, '2025-10-30', 4, 'Giá rẻ nhưng hơi ồn.', NULL),
(14, 12, 6, '2025-10-30', 3, 'đẹp', NULL),
(15, 12, 2, '2025-10-30', 3, 'đẹp', NULL),
(16, 8, 1, '2025-10-31', 2, 'nhu cut', NULL),
(17, 12, 29, '2025-11-19', 5, 'Đẹp\r\n              \r\n              \r\n              \r\n              \r\n              \r\n              \r\n              ', '[\"1763533516269_Screenshot 2025-02-11 003133.png\",\"1763533516270_Screenshot 2025-02-12 232308.png\",\"1763533516416_Screenshot 2025-02-16 125847.png\"]');

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
(11, 12, 'Nguyễn Văn A', '0912345611', '2025-10-10', '2025-10-15', '2025-10-17', 0, 1200000, 'Tìm được nơi khác tốt hơn'),
(12, 12, 'Nguyễn Văn B', '0123452290', '2025-09-25', '2025-09-28', '2025-09-30', 1, 1800000, NULL),
(13, 12, 'Võ Văn Tú Tài', '0341213412', '2025-09-10', '2025-09-12', '2025-09-14', 2, 950000, NULL),
(14, 12, 'Nguyễn Văn C', '0345435333', '2025-08-20', '2025-08-22', '2025-08-24', 2, 1350000, NULL),
(15, 12, 'Võ Văn Tú Tài', '0456347755', '2025-10-18', '2025-10-20', '2025-10-22', 3, 2100000, 'Thay đổi kế hoạch');

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
(4, NULL, 'Phạm Thị D', 'kh4@example.com', '0901000004', '1993-04-22', 'Nữ'),
(5, NULL, 'Hoàng Văn E', 'kh5@example.com', '0901000005', '1992-05-05', 'Nam'),
(6, NULL, 'Đỗ Thị F', 'kh6@example.com', '0901000006', '1997-06-18', 'Nữ'),
(7, NULL, 'Vũ Văn G', 'kh7@example.com', '0901000007', '1991-07-30', 'Nam'),
(8, NULL, 'Bùi Thị H', 'kh8@example.com', '0901000008', '1998-08-12', 'Nữ'),
(9, NULL, 'Phan Văn I', 'kh9@example.com', '0901000009', '1990-09-25', 'Nam'),
(10, NULL, 'Đặng Thị K', 'kh10@example.com', '0901000010', '1999-10-08', 'Nữ'),
(11, NULL, 'Tuyền', 'abc123@gmail.com', '0123456780', '2025-10-01', 'Nam'),
(12, 12, 'Tú Tài', 'tutai@gmail.com', '0909090909', '1111-01-01', 'Khác'),
(13, NULL, 'Tuyn', 'cc@gmail.com', '0123456789', '2025-10-01', 'Nam'),
(14, NULL, 'ngườ mới', 'nguoimoi@gmail.com', '0123481901', '1111-11-11', 'Nam'),
(15, 14, 'trungtran', 'trantrung1@gmail.com', '0386861386', '2025-09-30', 'Nam'),
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
(2, 2, 'Resort Biển Xanh', 'Techcombank - 0234567890', 'Resort', 'GP02', 'Đã khóa', 2, NULL),
(3, 3, 'Hotel Central', 'ACB - 0345678901', 'Khách sạn', 'GP03', 'Đã khóa', 4, NULL),
(4, 4, 'Homestay Hòa Bình', 'MB Bank - 0456789012', 'Homestay', 'GP04', 'Đang hoạt động', 3, NULL),
(5, 5, 'Villa Đại Dương', 'Agribank - 0567890123', 'Villa', 'GP05', 'Đang hoạt động', 5, NULL),
(6, 6, 'Hotel Dĩ An', 'BIDV - 0678901234', 'Khách sạn', 'GP06', 'Đã khóa', 6, NULL),
(7, 7, 'Resort Nha Trang Bay', 'VPBank - 0789012345', 'Resort', 'GP07', 'Chờ Duyệt', 7, NULL),
(8, 8, 'Sunrise Hotel', 'VietinBank - 0890123456', 'Khách sạn', 'GP08', 'Chờ Duyệt', 8, NULL),
(9, 9, 'Highland Retreat', 'Sacombank - 0901234567', 'Resort', 'GP09', 'Đang hoạt động', 9, NULL),
(10, 10, 'Lâm Đồng Villa', 'ACB - 0912345678', 'Villa', 'GP10', 'Đang hoạt động', 10, NULL),
(11, 17, 'Nguyen Van Tuan', '123456789', 'NhaNghi', '3000_secure_1.png', 'Chờ Duyệt', 23, 'VCB');

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
('PH009ưefee', 'Trân trọng phản hồi của bạn.', '2025-10-14', 9, 9),
('PH010', 'Xin cảm ơn và hẹn gặp lại.', '2025-10-15', 17, 1);

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
(1, 'Phòng 2 người', 7, 100000, 2, 2, '[\"1762662549635-868056217.png\",\"1762662549644-880707914.png\"]', 'mô tả mới sửa', 1, 2.66667, 1),
(2, 'phòng xịn', 2, 700000, 2, 1, 'unnamed.jpg', NULL, 2, 3.5, 2),
(3, 'phòng xịn', 3, 1200000, 2, 1, 'unnamed.jpg', NULL, 3, 5, 3),
(4, 'phòng xịn', 4, 900000, 4, 1, 'unnamed.jpg', NULL, 4, 5, 4),
(5, 'phòng xịn', 5, 400000, 6, 1, 'unnamed.jpg', NULL, 5, 3.5, 5),
(6, 'phòng xịn', 6, 1500000, 2, 1, 'unnamed.jpg', NULL, 6, 4, 6),
(7, 'phòng xịn', 7, 1800000, 2, 1, 'unnamed.jpg', NULL, 7, 5, 7),
(8, 'phòng xịn', 8, 1600000, 2, 1, 'unnamed.jpg', NULL, 8, 5, 8),
(9, 'phòng xịn', 9, 2000000, 3, 1, 'unnamed.jpg', NULL, 9, 5, 9),
(10, 'phòng xịn', 10, 2200000, 2, 1, 'unnamed.jpg', NULL, 10, 5, 10),
(13, 'Phòng Deluxe Twin', 5, 800000, 2, 1, 'unnamed.jpg', NULL, 11, 5, 5),
(14, 'Phòng Suite Hạng Sang', 5, 1200000, 3, 1, 'unnamed.jpg', NULL, 12, 5, 5),
(19, 'Phòng mới 2', 6, 22222222, 2, 2, '[\"1762593059784-695741525.png\",\"1762593059786-655338892.png\"]', NULL, 20, 5, 1),
(22, 'Phòng mớ nhất', 7, 100000, 2, 2, '[\"1762314712108-530438905-3000_secure_1.png\"]', 'Mô tả cho phòng', 25, 5, 1),
(27, 'jqsdnwiqdww', 5, 1000000, 3, 0, '[\"1762479573167-889384706.png\",\"1762479573172-437286917.png\",\"1762479573177-552756191.png\"]', 'ưqoknxqoxwoqoqxnnoq', 30, 5, 1),
(28, 'phòng xịn 123122', 3, 100000, 1, 1, '[\"1762590796874-440909202.png\",\"1762590796878-711896067.png\",\"1762590796879-453484738.png\"]', 'scdfsaf', 31, 5, 1),
(29, 'phòng xịn 123122', 3, 100000, 1, 1, '[\"1762590883729-180072179.png\",\"1762590883729-275960578.png\",\"1762590883731-870233502.png\"]', 'scdfsaf', 32, 5, 1),
(30, 'phòng xịn 123122', 3, 100000, 1, 1, '[\"1762590966086-33294388.png\",\"1762590966087-284334018.png\",\"1762590966090-711810108.png\",\"1762590966093-699439204.png\",\"1762590966101-680327853.png\"]', 'scdfsaf', 33, 5, 1),
(31, 'phòng xịn 123122', 3, 100000, 1, 1, '[\"1762591459198-654937712.png\"]', 'scdfsaf', 34, 5, 1),
(32, 'phòng xịn 123122', 3, 100000, 1, 1, '[\"1762591619890-536775411.png\"]', 'scdfsaf', 35, 5, 1),
(33, 'phòng xịn 123122', 3, 100000, 1, 1, '[\"1762591987206-428571613.png\"]', 'scdfsaf', 36, 5, 1);

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
('03Uw00lwUwWGhVYFNcHyexAaEEmD5CJi', 1765006859, '{\"cookie\":{\"originalMaxAge\":7200000,\"expires\":\"2025-12-06T07:40:59.498Z\",\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}'),
('Fk1NfcZEI9Xe4Unl_XNbsKKNOOMqk54f', 1765012592, '{\"cookie\":{\"originalMaxAge\":false,\"expires\":false,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"user\":{\"MaTaiKhoan\":12,\"TaiKhoan\":\"tutai@gmail.com\",\"PhanQuyen\":\"NhaCungCap\",\"TrangThai\":\"HoatDong\",\"MaNCC\":1,\"TenNCC\":\"Khách sạn Hoàng Gia\"}}'),
('Zsm_BbVBhbW8BaqZxPA-p_0xcUYQKjgG', 1765088186, '{\"cookie\":{\"originalMaxAge\":false,\"expires\":false,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"user\":{\"MaTaiKhoan\":12,\"TaiKhoan\":\"tutai@gmail.com\",\"PhanQuyen\":\"NhaCungCap\",\"TrangThai\":\"HoatDong\",\"MaNCC\":1,\"TenNCC\":\"Khách sạn Hoàng Gia\"}}');

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
(1, 'admin1@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:02:19', 'Admin', 'HoatDong'),
(2, 'admin2@gmail.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:02:19', 'Admin', 'HoatDong'),
(3, 'kh1@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(4, 'kh2@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(5, 'kh3@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(6, 'kh4@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(7, 'kh5@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(8, 'kh6@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'KhachHang', 'HoatDong'),
(9, 'kh7@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'NhaCungCap', 'HoatDong'),
(10, 'kh8@example.com', '$2a$10$9f8dWq7gDEzE/fakehashedpwdexample', '2025-10-20 10:46:27', 'NhaCungCap', 'HoatDong'),
(11, 'abc123@gmail.com', '$2b$10$.j/ciBEvJN2lBN97REPI8uVvX.ZSmFakHE6rf/uAa5OtvARZZySty', '2025-10-21 05:52:30', 'KhachHang', 'HoatDong'),
(12, 'tutai@gmail.com', '$2b$10$Z2t9fzKHiZQZoUTsUPJY2uVo4xrCo06UWmCiwKHDuRC4zzV0IrRpm', '2025-10-22 00:00:04', 'NhaCungCap', 'HoatDong'),
(13, 'cc@gmail.com', '$2b$10$dFZzbNEdicLY.l42EMe/nO6XbZXDo2Bx9aYgxNQU8bYktAb..WEdu', '2025-10-23 09:35:32', 'KhachHang', 'Khoa'),
(14, 'trantrung1@gmail.com', '$2b$10$H6GBAUdMEDuBYwTmJpEXeeqVcOmCIDBk.nVnbtroneyFA6q74OAWi', '2025-10-30 08:11:17', 'Admin', 'HoatDong'),
(15, 'tutai2@gmail.com', '$2b$10$MbMsJQsA3xn.TP3.JbrWj.FKMynAW5W9rbESdjdWn7vEMFRlyIF22', '2025-10-30 08:40:24', 'KhachHang', 'HoatDong'),
(17, 'tuanvan@gmail.com', '$2b$10$wxbN7dnxX/uRK4q4XS2JxeJ42Z9EAbjy8179DxwRxA8GoILGFg.4C', '2025-10-30 08:45:04', 'NhaCungCap', 'ChoDuyet'),
(18, 'cobatuoc@gmail.com', '$2b$10$DNOXpTT8BbygAAsaV5tiWe2of3dQwo6kqMqMp0q.oWLSvtZQhqcgS', '2025-10-30 08:56:13', 'KhachHang', 'Khoa');

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
(20, 13, '2025-11-16', 950000);

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
  MODIFY `MaCTDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT cho bảng `danhgia`
--
ALTER TABLE `danhgia`
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
  MODIFY `MaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `MaKhachHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
  MODIFY `MaTaiKhoan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  MODIFY `MaThanhToan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
  ADD CONSTRAINT `fk_dg_kh` FOREIGN KEY (`MaKhachHang`) REFERENCES `khachhang` (`MaKhachHang`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dg_phong` FOREIGN KEY (`MaPhong`) REFERENCES `phong` (`MaPhong`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `diachi`
--
ALTER TABLE `diachi`
  ADD CONSTRAINT `fk_diachi_xa` FOREIGN KEY (`MaXa`) REFERENCES `xa` (`MaXa`) ON UPDATE CASCADE;

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
  ADD CONSTRAINT `fk_phanhoi_danhgia` FOREIGN KEY (`MaDanhGia`) REFERENCES `danhgia` (`MaDanhGia`) ON DELETE CASCADE ON UPDATE CASCADE,
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


--
-- Tạo VIEW nhà cung cấp và 
--
CREATE VIEW VIEW_NCC_PHONG (MaNCC, LOAIPHONG, TINHTRANG, SOLUONG) AS 
SELECT n.MaNCC, p.MaLoai AS LOAIPHONG, p.TINHTRANG, COUNT(p.MAPHONG) AS SOLUONG
FROM phong p 
LEFT JOIN nhacungcap n ON p.MaNhaCungCap = n.MaNCC 
GROUP BY n.MaNCC, p.MaLoai, p.TINHTRANG;

-- DROP VIEW NCC_PHONG;

--
-- Tạo VIEW doanh thu nhà cung cấp
--
CREATE VIEW VIEW_NCC_DOANHTHU (MaNCC, NAM, THANG, DOANHTHU) AS 
SELECT N.MANCC, YEAR(D.NgayDat) AS NAM, MONTH(D.NgayDat) AS THANG, SUM(D.TongTien) AS DoanhThu FROM DONDATPHONG D 
LEFT JOIN CHITIETDONDATPHONG C ON D.MADON = C.MADON
LEFT JOIN PHONG P ON C.MAPHONG = P.MAPHONG
LEFT JOIN NHACUNGCAP N ON P.MANHACUNGCAP = N.MANCC
WHERE D.TRANGTHAI = 2
GROUP BY N.MANCC, YEAR(D.NgayDat), MONTH(D.NgayDat);

-- DROP VIEW VIEW_NCC_DOANHTHU;

--
-- Tạo VIEW don dat phong
--
CREATE VIEW VIEW_NCC_DONDATPHONG (MaNCC, TRANGTHAI, SOLUONG) AS 
SELECT N.MANCC, D.TRANGTHAI, COUNT(D.MADON) AS SOLUONG FROM DONDATPHONG D 
LEFT JOIN CHITIETDONDATPHONG C ON D.MADON = C.MADON
LEFT JOIN PHONG P ON C.MAPHONG = P.MAPHONG
LEFT JOIN NHACUNGCAP N ON P.MANHACUNGCAP = N.MANCC
GROUP BY N.MANCC, D.TRANGTHAI;

-- DROP VIEW VIEW_NCC_DONDATPHONG;
-- SELECT TRANGTHAI, SOLUONG FROM VIEW_NCC_DONDATPHONG
