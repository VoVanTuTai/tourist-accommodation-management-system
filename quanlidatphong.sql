-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 18, 2025 lúc 03:47 AM
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
(7, 'Hoàng Ngọc Mai');

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
(7, 7, 7, 1800000);

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
(1, 1, 1, '2024-06-01', 5, 'Phòng sạch, thoải mái', 'dg1.jpg'),
(2, 2, 2, '2024-06-02', 4, 'Tốt nhưng hơi ồn', 'dg2.jpg'),
(3, 3, 3, '2024-06-03', 5, 'Rất tuyệt vời', 'dg3.jpg'),
(4, 4, 4, '2024-06-04', 3, 'Cần cải thiện dịch vụ', 'dg4.jpg'),
(5, 5, 5, '2024-06-05', 4, 'Ổn so với giá', 'dg5.jpg'),
(6, 6, 6, '2024-06-06', 5, 'View đẹp và yên tĩnh', 'dg6.jpg'),
(7, 7, 7, '2024-06-07', 5, 'Cực kỳ hài lòng', 'dg7.jpg');

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
('DC007', '99 Hùng Vương', 'X07');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dondatphong`
--

CREATE TABLE `dondatphong` (
  `MaDon` int(11) NOT NULL,
  `MaKhachHang` int(11) NOT NULL,
  `NgayDat` date DEFAULT NULL,
  `TrangThai` tinyint(4) DEFAULT 0,
  `TongTien` double DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dondatphong`
--

INSERT INTO `dondatphong` (`MaDon`, `MaKhachHang`, `NgayDat`, `TrangThai`, `TongTien`) VALUES
(1, 1, '2024-07-01', 1, 500000),
(2, 2, '2024-07-02', 1, 700000),
(3, 3, '2024-07-03', 0, 1200000),
(4, 4, '2024-07-04', 1, 900000),
(5, 5, '2024-07-05', 1, 400000),
(6, 6, '2024-07-06', 0, 1500000),
(7, 7, '2024-07-07', 1, 1800000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

CREATE TABLE `khachhang` (
  `MaKhachHang` int(11) NOT NULL,
  `HoTen` varchar(150) NOT NULL,
  `MaTK` int(11) DEFAULT NULL,
  `MaDiaChi` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`MaKhachHang`, `HoTen`, `MaTK`, `MaDiaChi`) VALUES
(1, 'Nguyễn Văn Nam', 3, 'DC001'),
(2, 'Trần Thị Hương', 4, 'DC002'),
(3, 'Lê Minh Tuấn', 5, 'DC003'),
(4, 'Phạm Hoài An', 6, 'DC004'),
(5, 'Vũ Ngọc Linh', 7, 'DC005'),
(6, 'Bùi Thanh Hòa', 3, 'DC006'),
(7, 'Đặng Quang Nhật', 4, 'DC007');

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
(7, 'Phòng cao cấp', 'Phòng sang trọng, nội thất hiện đại');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhacungcap`
--

CREATE TABLE `nhacungcap` (
  `MaNCC` int(11) NOT NULL,
  `TenNCC` varchar(200) NOT NULL,
  `ThongTinThanhToan` varchar(200) DEFAULT NULL,
  `LoaiHinh` varchar(50) DEFAULT NULL,
  `GiayPhepKD` varchar(100) DEFAULT NULL,
  `MaDiaChi` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhacungcap`
--

INSERT INTO `nhacungcap` (`MaNCC`, `TenNCC`, `ThongTinThanhToan`, `LoaiHinh`, `GiayPhepKD`, `MaDiaChi`) VALUES
(1, 'Khách sạn Hoàng Gia', 'Vietcombank - 0123456789', 'Khách sạn', 'GP01', 'DC001'),
(2, 'Resort Biển Xanh', 'Techcombank - 0234567890', 'Resort', 'GP02', 'DC002'),
(3, 'Hotel Central', 'ACB - 0345678901', 'Khách sạn', 'GP03', 'DC003'),
(4, 'Homestay Hòa Bình', 'MB Bank - 0456789012', 'Homestay', 'GP04', 'DC004'),
(5, 'Villa Đại Dương', 'Agribank - 0567890123', 'Villa', 'GP05', 'DC005'),
(6, 'Hotel Dĩ An', 'BIDV - 0678901234', 'Khách sạn', 'GP06', 'DC006'),
(7, 'Resort Nha Trang Bay', 'VPBank - 0789012345', 'Resort', 'GP07', 'DC007');

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
('PH01', 'Dịch vụ rất tốt', '2024-05-01', 1, 1),
('PH02', 'Phòng sạch sẽ, nhân viên thân thiện', '2024-05-02', 2, 2),
('PH03', 'Giá hợp lý, vị trí đẹp', '2024-05-03', 3, 3),
('PH04', 'Ăn sáng ngon, phục vụ nhanh', '2024-05-04', 4, 4),
('PH05', 'Có hồ bơi đẹp', '2024-05-05', 5, 5),
('PH06', 'Phòng hơi nhỏ', '2024-05-06', 6, 6),
('PH07', 'Rất đáng tiền', '2024-05-07', 7, 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phong`
--

CREATE TABLE `phong` (
  `MaPhong` int(11) NOT NULL,
  `MaLoai` int(11) NOT NULL,
  `Gia` double NOT NULL DEFAULT 0,
  `SucChua` int(11) DEFAULT 1,
  `TinhTrang` tinyint(4) DEFAULT 1,
  `HinhAnh` varchar(255) DEFAULT NULL,
  `MaNhaCungCap` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phong`
--

INSERT INTO `phong` (`MaPhong`, `MaLoai`, `Gia`, `SucChua`, `TinhTrang`, `HinhAnh`, `MaNhaCungCap`) VALUES
(1, 1, 500000, 1, 1, 'phongdon.jpg', 1),
(2, 2, 700000, 2, 1, 'phongdoi.jpg', 2),
(3, 3, 1200000, 2, 1, 'phongvip.jpg', 3),
(4, 4, 900000, 4, 1, 'phonggiadinh.jpg', 4),
(5, 5, 400000, 6, 1, 'phongtapthe.jpg', 5),
(6, 6, 1500000, 2, 1, 'phongbien.jpg', 6),
(7, 7, 1800000, 2, 1, 'phongcaocap.jpg', 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `MaTK` int(11) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `SoDienThoai` varchar(15) DEFAULT NULL,
  `PhanQuyen` tinyint(4) DEFAULT 0,
  `NgayLap` date DEFAULT NULL,
  `MaAdmin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`MaTK`, `Email`, `MatKhau`, `SoDienThoai`, `PhanQuyen`, `NgayLap`, `MaAdmin`) VALUES
(1, 'quan1@gmail.com', '123456', '0901111111', 1, '2024-01-01', 1),
(2, 'lan2@gmail.com', '123456', '0902222222', 1, '2024-01-02', 2),
(3, 'anh3@gmail.com', '123456', '0903333333', 0, '2024-01-03', 3),
(4, 'bao4@gmail.com', '123456', '0904444444', 0, '2024-01-04', 4),
(5, 'hanh5@gmail.com', '123456', '0905555555', 0, '2024-01-05', 5),
(6, 'tai6@gmail.com', '123456', '0906666666', 0, '2024-01-06', 6),
(7, 'mai7@gmail.com', '123456', '0907777777', 0, '2024-01-07', 7);

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
(1, 1, '2024-07-02', 500000),
(2, 2, '2024-07-03', 700000),
(3, 3, '2024-07-04', 1200000),
(4, 4, '2024-07-05', 900000),
(5, 5, '2024-07-06', 400000),
(6, 6, '2024-07-07', 1500000),
(7, 7, '2024-07-08', 1800000);

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
('T07', 'Khánh Hòa');

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
('X07', 'Phường Nha Trang', 'T07');

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
  ADD KEY `fk_kh_taikhoan` (`MaTK`),
  ADD KEY `fk_kh_diachi` (`MaDiaChi`);

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
  ADD KEY `fk_phong_ncc` (`MaNhaCungCap`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`MaTK`),
  ADD UNIQUE KEY `Email` (`Email`),
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
  MODIFY `MaAdmin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `chitietdondatphong`
--
ALTER TABLE `chitietdondatphong`
  MODIFY `MaCTDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  MODIFY `MaDanhGia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `dondatphong`
--
ALTER TABLE `dondatphong`
  MODIFY `MaDon` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  MODIFY `MaKhachHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `loaiphong`
--
ALTER TABLE `loaiphong`
  MODIFY `MaLoai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `nhacungcap`
--
ALTER TABLE `nhacungcap`
  MODIFY `MaNCC` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `phong`
--
ALTER TABLE `phong`
  MODIFY `MaPhong` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `MaTK` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  MODIFY `MaThanhToan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- Các ràng buộc cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  ADD CONSTRAINT `fk_kh_diachi` FOREIGN KEY (`MaDiaChi`) REFERENCES `diachi` (`MaDiaChi`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_kh_taikhoan` FOREIGN KEY (`MaTK`) REFERENCES `taikhoan` (`MaTK`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `nhacungcap`
--
ALTER TABLE `nhacungcap`
  ADD CONSTRAINT `fk_ncc_diachi` FOREIGN KEY (`MaDiaChi`) REFERENCES `diachi` (`MaDiaChi`) ON DELETE SET NULL ON UPDATE CASCADE;

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
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `fk_taikhoan_admin` FOREIGN KEY (`MaAdmin`) REFERENCES `admin` (`MaAdmin`) ON DELETE SET NULL ON UPDATE CASCADE;

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
