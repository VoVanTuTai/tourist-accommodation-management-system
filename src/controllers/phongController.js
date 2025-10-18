import { getAllRooms } from "../models/phong.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await getAllRooms();
    res.render("home", { rooms });
  } catch (error) {
    console.error("Lỗi lấy danh sách phòng:", error);
    res.status(500).send("Lỗi server");
  }
};
