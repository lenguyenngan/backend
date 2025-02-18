import Teacher from "../model/teacher.js";
import User from "../model/user.js";
// import TeacherPosition from "../model/teacherPosition.js";
import { nanoid } from "nanoid";

// Lấy danh sách giáo viên (1.1)
export const getTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const teachers = await Teacher.find()
      .populate("userId", "name email phoneNumber address")
      .populate("teacherPositions", "name code")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách giáo viên" });
  }
};

// Tạo giáo viên mới (1.3)
export const createTeacher = async (req, res) => {
  try {
    const { userId, startDate, teacherPositions, degrees } = req.body;

    // Kiểm tra userId hợp lệ không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User không tồn tại" });
    }

    // Sinh mã giáo viên ngẫu nhiên
    const code = nanoid(10);

    const newTeacher = new Teacher({
      userId,
      code,
      startDate,
      teacherPositions,
      degrees,
    });

    await newTeacher.save();
    res
      .status(201)
      .json({ message: "Tạo giáo viên thành công!", teacher: newTeacher });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo giáo viên", error: error.message });
  }
};
