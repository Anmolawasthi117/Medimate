import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js"; // Import this!
import {
  createPatient,
  getPatient,
  updatePatient,
  getPatientByDevice,
} from "../controllers/patient.controller.js";

const router = Router();

// --- UI/User Routes (PROTECTED) ---
// These require the user to be logged in
router.route("/").post(verifyJWT, createPatient);

router.route("/:deviceId")
  .get(verifyJWT, getPatient)
  .put(verifyJWT, updatePatient);

// --- ESP/Device Routes (PUBLIC or API KEY PROTECTED) ---
// The ESP chip calls this. It doesn't have a User JWT.
// Do NOT add verifyJWT here unless your ESP code sends the token.
router.route("/device/:deviceId").get(getPatientByDevice);

export default router;