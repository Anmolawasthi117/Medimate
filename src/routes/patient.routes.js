import { Router } from "express";
import { getPatient, createPatient, updatePatient } from "../controllers/patient.controller.js";

const router = Router();

router.route("/:deviceId").get(getPatient);
router.route("/").post(createPatient);
router.route("/:deviceId").put(updatePatient);

export default router;