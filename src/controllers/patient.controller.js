import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Patient } from "../models/patient.model.js";

const getPatient = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const patient = await Patient.findOne({ deviceId });
    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, patient, "Patient retrieved successfully"));
});

const createPatient = asyncHandler(async (req, res) => {
    const { name, deviceId, cartridges } = req.body;
    if (!name || !deviceId) {
        throw new ApiError(400, "Name and deviceId are required");
    }
    const existingPatient = await Patient.findOne({ deviceId });
    if (existingPatient) {
        throw new ApiError(400, "Device ID already in use");
    }
    const patient = new Patient({ name, deviceId, cartridges: cartridges || [] });
    await patient.save();
    return res
        .status(201)
        .json(new ApiResponse(201, patient, "Patient created successfully"));
});

const updatePatient = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { cartridges } = req.body;
    if (!cartridges) {
        throw new ApiError(400, "Cartridges array is required");
    }
    // Validate cartridge slots
    const invalidSlots = cartridges.some(c => c.slot < 0 || c.slot > 9 || !c.medicationName);
    if (invalidSlots) {
        throw new ApiError(400, "Invalid slot number or missing medication name");
    }
    const patient = await Patient.findOneAndUpdate(
        { deviceId },
        { $set: { cartridges } },
        { new: true }
    );
    if (!patient) {
        throw new ApiError(404, "Patient not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, patient, "Patient updated successfully"));
});

export { getPatient, createPatient, updatePatient };