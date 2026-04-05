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
    res.json(records);
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
      { new: true }
    );
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (err) {
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
    res.json({ message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};