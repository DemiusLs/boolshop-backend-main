import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

import printsRoutes from "./routes/print.js";
import ordersRoutes from "./routes/order.js";
import mailRoutes from "./routes/mail.js";
import paymentRoutes from "./routes/payment.js";
import imagePath from "./middlewares/imagePath.js";
import routeNotMiddleware from "./middlewares/route-not-middleware.js";
import errorHandler from "./middlewares/error-handler-middleware.js";

// Carica variabili ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.static("public"));
app.use(express.json());

// Rotte
app.use("/api/prints", imagePath, printsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/email", mailRoutes);
app.use("/api/create-payment-intent", paymentRoutes); // <-- coerente con il frontend

// Gestione 404 e errori
app.use(routeNotMiddleware);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server in ascolto sulla porta ${PORT}`);
});
