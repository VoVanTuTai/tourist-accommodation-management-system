const { DataTypes } = require('sequelize');
const db = require('../config/database');

const DonDatPhong = db.define('DonDatPhong', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  idKhachHang: { type: DataTypes.INTEGER, allowNull: false },
  tenChoO: { type: DataTypes.STRING, allowNull: false },
  ngayDat: { type: DataTypes.DATE, allowNull: false },
  ngayNhan: { type: DataTypes.DATE, allowNull: false },
  ngayTra: { type: DataTypes.DATE, allowNull: false },
  tongTien: { type: DataTypes.FLOAT, allowNull: false },
  trangThai: {
    type: DataTypes.ENUM('dat', 'dang_su_dung', 'hoan_tat', 'huy'),
    defaultValue: 'dat'
  },
});

module.exports = DonDatPhong;
