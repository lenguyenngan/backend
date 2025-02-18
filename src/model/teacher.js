import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  teacherPositions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "teacherpositions" },
  ],
  degrees: [
    {
      type: { type: String, required: true },
      school: { type: String, required: true },
      major: { type: String, required: true },
      year: { type: Number, required: true },
      isGraduated: { type: Boolean, required: true },
    },
  ],
});

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
