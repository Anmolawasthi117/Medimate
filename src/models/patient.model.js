import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const cartridgeSchema = new Schema({
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
    pillCount: {
        type: Number,
        default: 0 
    }
});

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
    cartridges: [cartridgeSchema] 
}, {
    timestamps: true
});

patientSchema.plugin(mongooseAggregatePaginate);

export const Patient = mongoose.model("Patient", patientSchema);
