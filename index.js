const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const printRoutes = require("./routes/print");
const orderRoutes = require("./routes/order");

app.use("/api/prints", printRoutes);
app.use("/api/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use(cors({
  origin: "*", // o da specificare esempio ["http://localhost:3000"]
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));