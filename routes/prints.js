const express = require("express");
const router = express.Router();
const printsController = require("../controllers/printsController");

// GET all prints
router.get("/", printsController.getAllPrints);

// GET one print by ID sluggificato
router.get("/:slug", printsController.getPrintBySlug);

module.exports = router;

