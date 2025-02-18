import { Router } from "express";
import Teacher from "../model/teacher.js";
import User from "../model/user.js";
import TeacherPosition from "../model/teacherPosition.js";
import { nanoid } from "nanoid";

const router = Router();

// Lấy danh sách giáo viên + phân trang
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const teachers = await Teacher.find()
      .populate({
        path: "teacherPosition",
        model: "TeacherPosition",
        strictPopulate: false,
      })
      .populate({
        path: "userId",
        model: "User",
        strictPopulate: false,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tạo giáo viên mới
router.post("/", async (req, res) => {
  try {
    const { email, teacherPositions, startDate, degrees } = req.body;

    // Kiểm tra user có tồn tại không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User chưa được tạo!" });
    }

    // Kiểm tra teacherPositions có phải là mảng không
    if (!Array.isArray(teacherPositions) || teacherPositions.length === 0) {
      return res
        .status(400)
        .json({ message: "TeacherPositions phải là một mảng hợp lệ!" });
    }

    // Kiểm tra vị trí công tác có tồn tại không
    const teacherPositionsExists = await TeacherPosition.find({
      _id: { $in: teacherPositions },
    });

    if (teacherPositionsExists.length !== teacherPositions.length) {
      return res
        .status(400)
        .json({ message: "TeacherPositions không hợp lệ!" });
    }

    // Kiểm tra giáo viên đã tồn tại chưa (theo userId)
    const existingTeacher = await Teacher.findOne({ userId: user._id });
    if (existingTeacher) {
      return res.status(400).json({ message: "Giáo viên đã tồn tại!" });
    }

    // Tạo mã giáo viên ngẫu nhiên
    let uniqueCode;
    let isDuplicate = true;
    while (isDuplicate) {
      uniqueCode = nanoid(10);
      const existingCode = await Teacher.findOne({ code: uniqueCode });
      if (!existingCode) isDuplicate = false;
    }

    // Tạo giáo viên mới
    const newTeacher = new Teacher({
      userId: user._id,
      code: uniqueCode,
      isActive: true,
      isDeleted: false,
      startDate,
      teacherPositions,
      degrees: degrees || [], // Đảm bảo luôn là mảng
    });

    await newTeacher.save();
    res
      .status(201)
      .json({ message: "Tạo giáo viên thành công!", teacher: newTeacher });
  } catch (error) {
    console.error("Lỗi khi tạo giáo viên:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
