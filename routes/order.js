import express from "express";
import ordersController from "../controllers/ordersController.js";

const router = express.Router();

// GET all orders
router.get("/", ordersController.getAllOrders);

// POST new order
router.post("/", ordersController.createOrder);

//DELETE order
router.delete('/:id', ordersController.deleteOrder);


export default router;

