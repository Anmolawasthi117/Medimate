import { Router } from "express";
import {
  createPatient,
  getPatient,
  updatePatient,
  getPatientByDevice,
} from "../controllers/patient.controller.js";

const router = Router();

// Create new patient (with schedule info)
router.route("/").post(createPatient);

// Get / Update patient by deviceId (for UI or ESP)
router.route("/:deviceId")
  .get(getPatient)
  .put(updatePatient);

// Get patient info by device (for ESP boot)
router.route("/device/:deviceId").get(getPatientByDevice);

export default router;
