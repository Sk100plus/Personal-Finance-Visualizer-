import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Routes
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";

// Models
import Product from "./models/Product.js";
import User from "./models/User.js";
import ProductStat from "./models/ProductStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import OverallStat from "./models/OverallStat.js";

import Transaction from "./models/Transaction.js";

import path from "path";
// Sample Data
import {
  dataProduct,
  dataUser,
  dataTransaction,
  dataProductStat,
  dataOverallStat,
  dataAffiliateStat
} from "./data/index.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: "https://personal-finance-visualizer-dv9t.onrender.com",
  credentials: true,
}));

/* ROUTES */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

const _dirname=path.resolve();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // Seed Products
    const existingProducts = await Product.find();
    if (existingProducts.length === 0) {
      await Product.insertMany(dataProduct);
      console.log("✅ Sample Product data inserted.");
    }

    // Seed Users
    const existingUsers = await User.find();
    if (existingUsers.length === 0) {
      await User.insertMany(dataUser);
      console.log("✅ Sample User data inserted.");
    }

    // Seed Transactions
    const existing = await Transaction.find();
    if (existing.length === 0) {
      await Transaction.insertMany(dataTransaction);
      console.log("✅ Transactions seeded successfully");
    } else {
      console.log("⚠️ Transactions already exist. Skipping seed.");
    }

    // Seed Product Stats
    const existingProductStats = await ProductStat.find();
    if (existingProductStats.length === 0) {
      await ProductStat.insertMany(dataProductStat);
      console.log("✅ Sample ProductStat data inserted.");
    }

    // Seed Overall Stats
    const existingOverallStats = await OverallStat.find();
    if (existingOverallStats.length === 0) {
      await OverallStat.insertMany(dataOverallStat);
      console.log("✅ Sample OverallStat data inserted.");
    }

    // Seed Affiliate Stats
    const existingAffiliateStats = await AffiliateStat.find();
    if (existingAffiliateStats.length === 0) {
      await AffiliateStat.insertMany(dataAffiliateStat);
      console.log("✅ Sample AffiliateStat data inserted.");
    }
  })
  .catch((error) => console.log(`❌ ${error} did not connect`));


  app.use(express.static(path.join(_dirname,"/client/dist")));
  app.get('*',(_,res)=>{
    res.sendFile(path.resolve(_dirname,"client","dist","index.html"));
  });
