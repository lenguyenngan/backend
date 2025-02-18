import TeacherPosition from "../model/teacherPosition.js";

export const createPosition = async (req, res) => {
  try {
    const { name, code, des, isActive } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "Tên và mã vị trí là bắt buộc" });
    }

    const existingPosition = await TeacherPosition.findOne({ code });
    if (existingPosition) {
      return res.status(400).json({ message: "Mã vị trí đã tồn tại!" });
    }

    const newPosition = new TeacherPosition({
      name,
      code,
      des,
      isActive: isActive ?? true,
    });
    await newPosition.save();

    res.status(201).json({
      message: "Tạo vị trí giáo viên thành công!",
      position: newPosition,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo vị trí giáo viên", error: error.message });
  }
};

export const getPositions = async (req, res) => {
  try {
    const positions = await TeacherPosition.find();
    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách vị trí giáo viên",
      error: error.message,
    });
  }
};
