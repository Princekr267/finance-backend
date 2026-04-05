import { FinancialRecords } from "../models/financialRecords.model.js";

export const getSummary = async (req, res) => {
  try {
    const records = await FinancialRecords.find({ is_deleted: false });
    const totalIncome = records
      .filter(r => r.type === "income")
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = records
      .filter(r => r.type === "expense")
      .reduce((sum, r) => sum + r.amount, 0);
    res.json({ totalIncome, totalExpenses, netBalance: totalIncome - totalExpenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getByCategory = async (req, res) => {
  try {
    const result = await FinancialRecords.aggregate([
      { $match: { is_deleted: false } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const result = await FinancialRecords.aggregate([
      { $match: { is_deleted: false } },
      { $group: {
        _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
        total: { $sum: "$amount" }
      }},
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};