import express from "express";
import {
  createPosition,
  getPositions,
} from "../controller/teacherPositionsController.js";

const router = express.Router();

router.post("/", createPosition);
router.get("/", getPositions);

export default router;
