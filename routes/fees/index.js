import express from "express";
import feesController from "../../controllers/fees/index.js";

const router = express.Router();

// CREATE FEES CONFIG
router.post("/fees", feesController.handleFeeConfig);
router.post("/compute-transaction-fee", feesController.handleTransactionFee);

export default router;
