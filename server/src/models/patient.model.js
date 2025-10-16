import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const patientSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    deviceId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // how many times a day meds are dispensed
    cycleType: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: true
    },
    // array of time strings like ["08:00", "14:00", "20:00"]
    schedule: [{
        type: String,
        match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
        required: true
    }],
    timezone: {
        type: String,
        default: "Asia/Kolkata"
    },
    lastSync: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

patientSchema.plugin(mongooseAggregatePaginate);

export const Patient = mongoose.model("Patient", patientSchema);
