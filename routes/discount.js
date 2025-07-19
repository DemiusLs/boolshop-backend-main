import express from "express";
import {
  getDiscountByCode,
  updateDiscountUsage,
  createDiscountCode
} from "../controllers/discountController.js";

const router = express.Router();

router.get("/:code", getDiscountByCode);
router.put("/:id", updateDiscountUsage);
router.post("/", createDiscountCode); 


export default router;