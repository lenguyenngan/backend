import { Schema, model } from "mongoose";

const teacherPositionSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  des: { type: String },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
});

const TeacherPosition = model("TeacherPosition", teacherPositionSchema);

export default TeacherPosition;
