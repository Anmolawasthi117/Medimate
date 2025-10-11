import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";
import { Log } from "../models/log.model.js";

const createLog = asyncHandler(async (req, res) => {
    const { deviceId, slot, medicationName, timestamp, status } = req.body;
    if (!deviceId || slot === undefined || !medicationName || !timestamp) {
        throw new ApiError(400, "Device ID, slot, medication name, and timestamp are required");
    }
    const patient = await Patient.findOne({ deviceId });
    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }
    // Validate slot and medication
    const cartridge = patient.cartridges.find(c => c.slot === slot && c.medicationName === medicationName);
    if (!cartridge) {
        throw new ApiError(400, "Slot or medication not assigned to patient");
    }
    const validStatuses = ["dispensed", "confirmed", "missed"];
    if (status && !validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status");
    }
    const log = new Log({
        patientId: patient._id,
        slot,
        medicationName,
        timestamp: new Date(timestamp * 1000), // Convert UNIX timestamp from ESP32
        status: status || "dispensed"
    });
    await log.save();
    return res
        .status(201)
        .json(new ApiResponse(201, log, "Log created successfully"));
});

const getLogs = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const patient = await Patient.findOne({ deviceId });
    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }
    const logs = await Log.find({ patientId: patient._id }).sort({ timestamp: -1 });
    return res
        .status(200)
        .json(new ApiResponse(200, logs, "Logs retrieved successfully"));
});

const generateReport = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const patient = await Patient.findOne({ deviceId });
    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
    const logs = await Log.find({
        patientId: patient._id,
        timestamp: { $gte: startDate, $lte: endDate }
    });
    const totalDoses = logs.length;
    const confirmedDoses = logs.filter(log => log.status === "confirmed").length;
    const compliance = totalDoses > 0 ? (confirmedDoses / totalDoses * 100).toFixed(2) : 0;
    const report = {
        period: `${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`,
        totalDoses,
        confirmedDoses,
        compliance: `${compliance}%`
    };
    return res
        .status(200)
        .json(new ApiResponse(200, report, "Weekly report generated successfully"));
});

export { createLog, getLogs, generateReport };