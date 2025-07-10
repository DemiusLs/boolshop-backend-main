import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import printsRoutes from "./routes/print.js";
import ordersRoutes from "./routes/order.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/prints", printsRoutes);
app.use("/api/orders", ordersRoutes);

app.listen(port, () => {
  console.log(`Server in ascolto alla porta ${port}`);
});
