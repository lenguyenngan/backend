import bcrypt from "bcrypt";
import User from "../model/user.js";

// Middleware xử lý tạo User nếu chưa tồn tại
const createUserIfNotExists = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, address, identity, dob, role, password } =
      req.body;

    // Kiểm tra xem email đã tồn tại hay chưa
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Hash mật khẩu trước khi lưu vào database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo User mới
    const newUser = new User({
      name,
      email,
      phoneNumber,
      address,
      identity,
      dob,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    // Gán user vào request để sử dụng sau này
    req.user = newUser;
    next(); // Chuyển sang middleware/controller tiếp theo
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo User", error: error.message });
  }
};

export default createUserIfNotExists;
