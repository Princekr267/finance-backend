import mongoose from "mongoose";

FinancialRecordsSchema = {
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
        emum: ["food", "health", "education", "transport", "rent", "salary", "entertainment", "other"]
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    description: {
        type: String,
        default: "",
        maxlength: [300, "Limit reached! 300 words is the limit"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}

const FinancialRecords = mongoose.model("FinancialRecords", FinancialRecordsSchema)

module.exports.FinancialRecords;