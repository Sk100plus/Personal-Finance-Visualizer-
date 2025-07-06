// models/Transaction.js
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  cost: Number,
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
