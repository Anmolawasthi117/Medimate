import { Router } from "express";
import {
  registerESP,
  getSchedule,
  createLog,
  sendHeartbeat,
  getWeeklyReport,
} from "../controllers/esp.controller.js";

const router = Router();

router.route("/register").post(registerESP);

router.route("/schedule/:deviceId").get(getSchedule);

router.route("/log").post(createLog);

router.route("/heartbeat").post(sendHeartbeat);

router.route("/:deviceId/report").get(getWeeklyReport);

export default router;
