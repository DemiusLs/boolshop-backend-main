import express from "express";
import cors from "cors";
import printsRoutes from "./routes/print.js";
import ordersRoutes from "./routes/order.js";

import imagePath from "./middlewares/imagePath.js";
import routeNotMiddleware from "./middlewares/route-not-middleware.js";
import errorHandler from "./middlewares/error-handler-middleware.js";





const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));


app.use(express.json());

app.use("/api/prints", imagePath, printsRoutes);
app.use("/api/orders", ordersRoutes);


app.use(routeNotMiddleware);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server in ascolto alla porta ${port}`);
});
