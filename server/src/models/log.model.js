import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const logSchema = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    scheduledTime: {
        type: String,
        required: true,
        match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ // e.g. "08:00"
    },
    date: {
        type: String,
        required: true // YYYY-MM-DD for easy queries
    },
    status: {
        type: String,
        enum: ["taken", "missed", "skipped"],
        default: "missed"
    },
    actualTime: {
        type: Date
    }
}, {
    timestamps: true
});

logSchema.plugin(mongooseAggregatePaginate);

export const Log = mongoose.model("Log", logSchema);
