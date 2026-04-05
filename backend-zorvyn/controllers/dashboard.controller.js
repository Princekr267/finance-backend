import { FinancialRecords } from "../models/financialRecords.model.js";

export const getSummary = async (req, res) => {
  try {
    const result = await FinancialRecords.aggregate([
      { $match: { is_deleted: false } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);
    const totalIncome = result.find(r => r._id === "income")?.total || 0;
    const totalExpenses = result.find(r => r._id === "expense")?.total || 0;
    res.json({ totalIncome, totalExpenses, netBalance: totalIncome - totalExpenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
``
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