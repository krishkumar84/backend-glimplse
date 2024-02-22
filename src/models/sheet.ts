import { Schema, model } from "mongoose";

const SheetSchema = new Schema({
    suid: {
        type: String,
        required: true
    },
    version: {
        type: Number,
        default: 0,
        enum: [0, 1, 2]
    },
    data: {
        type: String,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: "User"
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

export default model("Sheet", SheetSchema);
