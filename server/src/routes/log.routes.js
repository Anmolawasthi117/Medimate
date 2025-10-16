import { Router } from "express";
import {
  createLog,
  getLogs,
  generateReport,
  logButtonPress,
  logMissedDose,
  
} from "../controllers/log.controller.js";

const router = Router();

// UI / Admin API
router.route("/").post(createLog);
router.route("/:deviceId").get(getLogs);
router.route("/:deviceId/report").get(generateReport);

// ESP APIs
router.route("/esp/button-press").post(logButtonPress);
router.route("/esp/missed").post(logMissedDose);

export default router;
