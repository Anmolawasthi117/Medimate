import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";
import { Log } from "../models/log.model.js";

/**
 * @route POST /api/v1/esp/register
 * @desc Register ESP device and link to a patient
 */
const registerESP = asyncHandler(async (req, res) => {
  const { deviceId, name, cycleType, schedule } = req.body;

  if (!deviceId || !name || !cycleType || !schedule || !Array.isArray(schedule)) {
    throw new ApiError(400, "deviceId, name, cycleType, and schedule are required");
  }

  let patient = await Patient.findOne({ deviceId });

  if (patient) {
    // update if already exists
    patient.name = name;
    patient.cycleType = cycleType;
    patient.schedule = schedule;
    await patient.save();
  } else {
    patient = await Patient.create({ deviceId, name, cycleType, schedule });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "ESP device registered successfully"));
});

/**
 * @route GET /api/v1/esp/schedule/:deviceId
 * @desc Fetch current schedule for given ESP device
 */
const getSchedule = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;

  const patient = await Patient.findOne({ deviceId });
  if (!patient) throw new ApiError(404, "Patient not found");

  // Update last sync timestamp
  patient.lastSync = new Date();
  await patient.save();

  return res
    .status(200)
    .json(new ApiResponse(200, patient.schedule, "Schedule fetched successfully"));
});

/**
 * @route POST /api/v1/esp/log
 * @desc Log medication event (taken/missed/skipped)
 * @body { deviceId, scheduledTime, status, actualTime }
 */
const createLog = asyncHandler(async (req, res) => {
  const { deviceId, scheduledTime, status, actualTime } = req.body;

  if (!deviceId || !scheduledTime || !status) {
    throw new ApiError(400, "deviceId, scheduledTime, and status are required");
  }

  const patient = await Patient.findOne({ deviceId });
  if (!patient) throw new ApiError(404, "Patient not found");

  const validStatuses = ["taken", "missed", "skipped"];
  if (!validStatuses.includes(status)) throw new ApiError(400, "Invalid status");

  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const log = await Log.create({
    patientId: patient._id,
    scheduledTime,
    date,
    status,
    actualTime: actualTime ? new Date(actualTime) : null,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, log, "Log created successfully"));
});

/**
 * @route POST /api/v1/esp/heartbeat
 * @desc Used by ESP to ping server (for monitoring uptime)
 */
const sendHeartbeat = asyncHandler(async (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) throw new ApiError(400, "deviceId is required");

  const patient = await Patient.findOne({ deviceId });
  if (!patient) throw new ApiError(404, "Patient not found");

  patient.lastSync = new Date();
  await patient.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { lastSync: patient.lastSync }, "Heartbeat received"));
});

/**
 * @route GET /api/v1/esp/:deviceId/report
 * @desc Generate 7-day compliance + summary report
 */
const getWeeklyReport = asyncHandler(async (req, res) => {
  const { deviceId } = req.params;

  const patient = await Patient.findOne({ deviceId });
  if (!patient) throw new ApiError(404, "Patient not found");

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 7);

  const logs = await Log.find({
    patientId: patient._id,
    createdAt: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1, scheduledTime: 1 });

  const totalLogs = logs.length;
  const taken = logs.filter((l) => l.status === "taken").length;
  const missed = logs.filter((l) => l.status === "missed").length;
  const skipped = logs.filter((l) => l.status === "skipped").length;

  const compliance = totalLogs
    ? ((taken / totalLogs) * 100).toFixed(1)
    : "0.0";

  const dailyStats = {};
  logs.forEach((log) => {
    const day = log.date;
    if (!dailyStats[day]) {
      dailyStats[day] = { taken: 0, missed: 0, skipped: 0, total: 0 };
    }
    dailyStats[day][log.status]++;
    dailyStats[day].total++;
  });

  const report = {
    patientName: patient.name,
    deviceId: patient.deviceId,
    cycleType: patient.cycleType,
    period: {
      from: startDate.toISOString().split("T")[0],
      to: endDate.toISOString().split("T")[0],
    },
    summary: {
      totalLogs,
      taken,
      missed,
      skipped,
      compliance: `${compliance}%`,
    },
    dailyStats,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, report, "Weekly report generated successfully"));
});

export {
  registerESP,
  getSchedule,
  createLog,
  sendHeartbeat,
  getWeeklyReport,
};
