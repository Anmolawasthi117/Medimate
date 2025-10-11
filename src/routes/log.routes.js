import { Router } from "express";
import { createLog, getLogs, generateReport } from "../controllers/log.controller.js";

const router = Router();

router.route("/").post(createLog);
router.route("/:deviceId").get(getLogs);
router.route("/:deviceId/report").get(generateReport);

export default router;