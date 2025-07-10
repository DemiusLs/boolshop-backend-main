import express from "express";
import printsController from "../controllers/printsController.js";

const router = express.Router();

// GET all prints
router.get("/", printsController.getAllPrints);

// GET one print by slug
router.get("/:slug", printsController.getPrintBySlug);

export default router;
