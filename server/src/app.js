import cors from "cors";
import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (request, response) => {
  response.json({
    success: true,
    message: "Inventory Management API is running"
  });
});

app.use("/api/products", productRoutes);

app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use(errorHandler);

export default app;
