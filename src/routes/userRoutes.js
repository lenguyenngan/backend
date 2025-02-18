import { Router } from "express";
import createUserIfNotExists from "../middleware/userMiddleware.js";
import User from "../model/user.js";

const router = Router();

// API tạo User với middleware
router.post("/", createUserIfNotExists, async (req, res) => {
  try {
    const { user } = req; // user được tạo bởi middleware và gán vào request
    res.status(201).json({ message: "User tạo thành công!", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Thêm API GET để lấy danh sách user
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách user" });
  }
});

export default router;
