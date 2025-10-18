import express from "express";
import { getRooms } from "../controllers/phongController.js";
const router = express.Router();

router.get("/", getRooms);

export default router;
