import mongoose from "mongoose";

const FinancialRecordsSchema = new mongoose.Schema({
  amount: { 
        type: Number, 
        required: true,
        min: [0.01, "Amount must be greater than 0"]
    },
    type: {
        type: String,
        required: true, 
        enum: ["income", "expense"]
    },
    category: {
        type: String,
        required: true,
        enum: ["food", "health", "education", "transport", "rent", "salary", "entertainment", "other"]
    },
    date: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    description: { 
        type: String, 
        default: "", 
        maxlength: [300, "Limit reached"] 
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    is_deleted: {
        type: Boolean,
        default: false 
    }
}, 
{ timestamps: true }
);

export const FinancialRecords = mongoose.model("FinancialRecords", FinancialRecordsSchema);