import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  stockIn,
  stockOut,
  updateProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/stock-in", stockIn);
router.post("/:id/stock-out", stockOut);

export default router;
