import express from "express";
import cors from "cors";
import printsRoutes from "./routes/print.js";
import ordersRoutes from "./routes/order.js";
import ordersController from './controllers/ordersController.js';



const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

app.use("/api/prints", printsRoutes);
app.use("/api/orders", ordersRoutes);

app.listen(port, () => {
  console.log(`Server in ascolto alla porta ${port}`);
});
