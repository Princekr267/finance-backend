import { FinancialRecords } from "../models/financialRecords.model.js";

// CREATE - admin/analyst only
export const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;
    if (!amount || !type || !category || !date)
      return res.status(400).json({ message: "amount, type, category, date are required" });

    const record = await FinancialRecords.create({
      amount, type, category, date, description,
      createdBy: req.user.id
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL with filters - all roles
export const getRecords = async (req, res) => {
  try {
    const { type, category, date } = req.query;
    const filter = { is_deleted: false };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setMonth(end.getMonth() + 1);
      filter.date = { $gte: start, $lt: end };
    }
    const records = await FinancialRecords.find(filter).sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE - admin only
export const updateRecord = async (req, res) => {
  try {
    const record = await FinancialRecords.findOneAndUpdate(
      { _id: req.params.id, is_deleted: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid record ID" });
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message).join(", ");
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE - admin only
export const deleteRecord = async (req, res) => {
  try {
    const record = await FinancialRecords.findByIdAndUpdate(
      req.params.id,
      { is_deleted: true },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted" });
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid record ID" });
    res.status(500).json({ message: err.message });
  }
};