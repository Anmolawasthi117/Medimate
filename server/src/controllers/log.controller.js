import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";
import { Log } from "../models/log.model.js";

/**
 * @desc Create log manually (Admin/UI)
 */
const createLog = asyncHandler(async (req, res) => {
  const { deviceId, slot, medicationName, timestamp, status } = req.body;

  if (!deviceId || slot === undefined || !medicationName || !timestamp)
    throw new ApiError(400, "Device ID, slot, medication name, and timestamp are required");

  const patient = await Patient.findOne({ deviceId });
  if (!patient) throw new ApiError(404, "Patient not found");

  const validStatuses = ["dispensed", "confirmed", "missed"];
  if (status && !validStatuses.includes(status))
    throw new ApiError(400, "Invalid status");

  const log = await Log.create({
    patientId: patient._id,
    slot,
    medicationName,
    timestamp: new Date(timestamp * 1000),
    status: status || "dispensed",
  });

  return res.status(201).json(new ApiResponse(201, log, "Log created successfully"));
});

/**
 * @desc Get logs by deviceId
 */
const getLogs = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const patient = await Patient.findOne({ deviceId });
  if (!patient) throw new ApiError(404, "Patient not found");

  const logs = await Log.find({ patientId: patient._id }).sort({ timestamp: -1 });

  return res.status(200).json(new ApiResponse(200, logs, "Logs retrieved successfully"));
});

/**
 * @desc Weekly Report (7-day compliance)
 */
const generateReport = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const patient = await Patient.findOne({ deviceId });
  if (!patient) throw new ApiError(404, "Patient not found");

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  const logs = await Log.find({
    patientId: patient._id,
    timestamp: { $gte: startDate, $lte: endDate },
  });

  const total = logs.length;
  const confirmed = logs.filter(l => l.status === "confirmed").length;
  const missed = logs.filter(l => l.status === "missed").length;

  const compliance = total > 0 ? ((confirmed / total) * 100).toFixed(2) : 0;

  return res.status(200).json(
    new ApiResponse(200, {
      total,
      confirmed,
      missed,
      compliance: `${compliance}%`,
      from: startDate.toISOString().split("T")[0],
      to: endDate.toISOString().split("T")[0],
    }, "Weekly report generated successfully")
  );
});

/**
 * @desc ESP → logs button press (med taken)
 */
const logButtonPress = asyncHandler(async (req, res) => {
  const { deviceId, slot } = req.body;

  if (!deviceId || slot === undefined)
    throw new ApiError(400, "deviceId and slot are required");

  const patient = await Patient.findOne({ deviceId });
  if (!patient) throw new ApiError(404, "Patient not found");

  const log = await Log.create({
    patientId: patient._id,
    slot,
    timestamp: new Date(),
    status: "confirmed",
  });

  return res.status(200).json(new ApiResponse(200, log, "Medication confirmed (button pressed)"));
});

/**
 * @desc ESP → logs missed dose (no button press within window)
 */
const logMissedDose = asyncHandler(async (req, res) => {
  const { deviceId, slot } = req.body;

  if (!deviceId || slot === undefined)
    throw new ApiError(400, "deviceId and slot are required");

  const patient = await Patient.findOne({ deviceId });
  if (!patient) throw new ApiError(404, "Patient not found");

  const log = await Log.create({
    patientId: patient._id,
    slot,
    timestamp: new Date(),
    status: "missed",
  });

  return res.status(200).json(new ApiResponse(200, log, "Missed dose logged"));
});

export {
  createLog,
  getLogs,
  generateReport,
  logButtonPress,
  logMissedDose,
};
