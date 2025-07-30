// index.js or server.js (ES Module version)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRouter from "./Routes/AuthRouter.js";
import ProductRouter from "./Routes/ProductRouter.js";
import dbconnect from "./config/mongodb.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8080;

// Connect to DB
dbconnect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
