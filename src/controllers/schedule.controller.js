import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";
import { Schedule } from "../models/schedule.model.js";

const getSchedule = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const patient = await Patient.findOne({ deviceId });
    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }
    const schedules = await Schedule.find({ patientId: patient._id });
    // Format for ESP32: [{slot, times: [minutes, ...], timeCount}]
    const formattedSchedules = schedules.map(schedule => ({
        slot: schedule.slot,
        times: schedule.times.map(time => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
        }),
        timeCount: schedule.times.length
    }));
    return res
        .status(200)
        .json(new ApiResponse(200, formattedSchedules, "Schedules retrieved successfully"));
});

const createSchedule = asyncHandler(async (req, res) => {
    const { patientId, slot, medicationName, times, startDate, endDate } = req.body;
    if (!patientId || slot === undefined || !medicationName || !times?.length) {
        throw new ApiError(400, "Patient ID, slot, medication name, and times are required");
    }
    const patient = await Patient.findById(patientId);
    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }
    // Validate slot and medication
    const cartridge = patient.cartridges.find(c => c.slot === slot && c.medicationName === medicationName);
    if (!cartridge) {
        throw new ApiError(400, "Slot or medication not assigned to patient");
    }
    // Validate times format (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!times.every(time => timeRegex.test(time))) {
        throw new ApiError(400, "Invalid time format. Use HH:MM");
    }
    const schedule = new Schedule({
        patientId,
        slot,
        medicationName,
        times,
        startDate: startDate || Date.now(),
        endDate
    });
    await schedule.save();
    return res
        .status(201)
        .json(new ApiResponse(201, schedule, "Schedule created successfully"));
});

const deleteSchedule = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) {
        throw new ApiError(404, "Schedule not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Schedule deleted successfully"));
});

export { getSchedule, createSchedule, deleteSchedule };