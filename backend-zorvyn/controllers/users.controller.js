import { userModel } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["viewer", "analyst", "admin"].includes(role))
      return res.status(400).json({ message: "Invalid role" });
    const user = await userModel.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await userModel.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};