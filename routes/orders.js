const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

// GET all orders
router.get("/", ordersController.getAllOrders);

// POST new order
router.post("/", ordersController.createOrder);

module.exports = router;
