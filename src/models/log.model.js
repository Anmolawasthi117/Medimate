import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const logSchema = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    slot: {
        type: Number,
        required: true,
        min: 0,
        max: 9
    },
    medicationName: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["dispensed", "confirmed", "missed"],
        default: "dispensed"
    }
}, {
    timestamps: true
});

logSchema.plugin(mongooseAggregatePaginate);

export const Log = mongoose.model("Log", logSchema);