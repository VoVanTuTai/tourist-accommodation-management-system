const LoaiPhong = {
  async getAll() {
    try {
      const db = await dbPromise;
      const [rows] = await db.execute("SELECT * FROM LoaiPhong");
      return rows;
    } catch (err) {
      console.error("❌ Lỗi truy vấn LoaiPhong:", err);
      return [];
    }
  },
};

module.exports = LoaiPhong;