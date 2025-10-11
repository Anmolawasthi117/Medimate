import { Router } from "express";
import { getSchedule, createSchedule, deleteSchedule } from "../controllers/schedule.controller.js";

const router = Router();

router.route("/:deviceId").get(getSchedule);
router.route("/").post(createSchedule);
router.route("/:id").delete(deleteSchedule);

export default router;