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
      return res.status(400).json({ message: "Invalid role. Must be viewer, analyst, or admin" });
    const user = await userModel.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid user ID" });
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== "boolean")
      return res.status(400).json({ message: "isActive must be a boolean" });
    const user = await userModel.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid user ID" });
    res.status(500).json({ message: err.message });
  }
};