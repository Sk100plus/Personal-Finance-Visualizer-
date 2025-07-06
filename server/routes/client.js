import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
} from "../controllers/client.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const search = req.query.search || "";

    const transactions = await Transaction.find({
      // implement basic search if needed
    })
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments();

    res.status(200).json({ transactions, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/geography", getGeography);

export default router;
