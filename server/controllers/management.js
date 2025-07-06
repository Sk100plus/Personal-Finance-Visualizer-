import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    // Fetch user with affiliate stats using aggregation
    const userWithStats = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "affiliatestats", // Collection name in lowercase and plural
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      { $unwind: "$affiliateStats" }, // Will remove the user if no stats exist
    ]);

    if (!userWithStats.length) {
      return res
        .status(404)
        .json({ message: "User not found or no affiliate stats." });
    }

    // Fetch sales transactions
    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((saleId) =>
        Transaction.findById(saleId)
      )
    );

    // Filter out any null results
    const filteredSales = saleTransactions.filter(Boolean);

    return res.status(200).json({
      user: userWithStats[0],
      sales: filteredSales,
    });
  } catch (error) {
    console.error("Error in getUserPerformance:", error);
    return res.status(500).json({ message: "Server error." });
  }
};