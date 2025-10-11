import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const scheduleSchema = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    slot: {
        type: Number,
        required: true,
        min: 0,
        max: 6
    },
    medicationName: {
        type: String,
        required: true,
        trim: true
    },
    times: [{
        type: String,
        match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // Validates HH:MM format (e.g., "08:00")
        required: true
    }],
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date // Optional for temporary medications
    }
}, {
    timestamps: true
});

scheduleSchema.plugin(mongooseAggregatePaginate);

export const Schedule = mongoose.model("Schedule", scheduleSchema);