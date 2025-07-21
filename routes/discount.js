import express from "express";
import {
  getDiscountByCode,
  updateDiscountUsage,
  createDiscountCode
} from "../controllers/discountController.js";

const router = express.Router();

router.get("/:code", getDiscountByCode);
router.put("/update/:code", updateDiscountUsage);
router.post("/", createDiscountCode); 


export default router;