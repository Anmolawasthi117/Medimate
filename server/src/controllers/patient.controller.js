import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";

/**
 * @desc Get patient details by deviceId (for UI)
 */
const getPatient = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const patient = await Patient.findOne({ deviceId });

  if (!patient) throw new ApiError(404, "Patient not found");

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient retrieved successfully"));
});

/**
 * @desc Create patient with med cycle info
 * Expected body:
 * {
 *   name: "John Doe",
 *   deviceId: "ESP1234",
 *   cycleType: "4x/day", // or 2x/day
 *   schedule: {
 *     morning: "08:00",
 *     afternoon: "13:00",
 *     evening: "18:00",
 *     night: "22:00"
 *   }
 * }
 */
const createPatient = asyncHandler(async (req, res) => {
  const { name, deviceId, cycleType, schedule } = req.body;

  if (!name || !deviceId || !cycleType || !schedule)
    throw new ApiError(400, "Name, deviceId, cycleType, and schedule are required");

  const existingPatient = await Patient.findOne({ deviceId });
  if (existingPatient) throw new ApiError(400, "Device ID already in use");

  const patient = new Patient({
    name,
    deviceId,
    cycleType,
    schedule,
  });

  await patient.save();

  return res
    .status(201)
    .json(new ApiResponse(201, patient, "Patient created successfully"));
});

/**
 * @desc Update patient schedule or med info
 */
const updatePatient = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const { cycleType, schedule } = req.body;

  if (!cycleType && !schedule)
    throw new ApiError(400, "Nothing to update (missing cycleType or schedule)");

  const updatedPatient = await Patient.findOneAndUpdate(
    { deviceId },
    { $set: { cycleType, schedule } },
    { new: true }
  );

  if (!updatedPatient) throw new ApiError(404, "Patient not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPatient, "Patient updated successfully"));
});

/**
 * @desc Get patient info by device (for ESP boot sync)
 */
const getPatientByDevice = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;
  const patient = await Patient.findOne({ deviceId }).select("deviceId name cycleType schedule");

  if (!patient) throw new ApiError(404, "Patient not found");

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Schedule fetched for device"));
});

export { getPatient, createPatient, updatePatient, getPatientByDevice };
