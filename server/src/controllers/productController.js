import mongoose from "mongoose";
import Product from "../models/Product.js";

const getStockStatus = (product) => {
  if (product.stock === 0) {
    return "OUT_OF_STOCK";
  }

  if (product.stock <= product.lowStockThreshold) {
    return "LOW_STOCK";
  }

  return "IN_STOCK";
};

const addStatus = (product) => ({
  ...product.toObject(),
  status: getStockStatus(product)
});

const isValidProductId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleDatabaseError = (error, response) => {
  if (error.code === 11000) {
    response.status(409).json({
      success: false,
      message: "SKU already exists"
    });
    return true;
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((validationError) => validationError.message);
    response.status(400).json({
      success: false,
      message: messages.join(", ")
    });
    return true;
  }

  return false;
};

export const getProducts = async (request, response, next) => {
  try {
    const { search = "", category, status } = request.query;
    const query = {};

    if (search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { sku: { $regex: search.trim(), $options: "i" } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    const productsWithStatus = products.map(addStatus);
    const filteredProducts = status
      ? productsWithStatus.filter((product) => product.status === status)
      : productsWithStatus;

    response.json({
      success: true,
      data: filteredProducts
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (request, response, next) => {
  try {
    if (!isValidProductId(request.params.id)) {
      response.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
      return;
    }

    const product = await Product.findById(request.params.id);

    if (!product) {
      response.status(404).json({
        success: false,
        message: "Product not found"
      });
      return;
    }

    response.json({
      success: true,
      data: addStatus(product)
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (request, response, next) => {
  try {
    const product = await Product.create(request.body);

    response.status(201).json({
      success: true,
      data: addStatus(product)
    });
  } catch (error) {
    if (handleDatabaseError(error, response)) {
      return;
    }

    next(error);
  }
};

export const updateProduct = async (request, response, next) => {
  try {
    if (!isValidProductId(request.params.id)) {
      response.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
      return;
    }

    const product = await Product.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      response.status(404).json({
        success: false,
        message: "Product not found"
      });
      return;
    }

    response.json({
      success: true,
      data: addStatus(product)
    });
  } catch (error) {
    if (handleDatabaseError(error, response)) {
      return;
    }

    next(error);
  }
};

export const deleteProduct = async (request, response, next) => {
  try {
    if (!isValidProductId(request.params.id)) {
      response.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
      return;
    }

    const product = await Product.findByIdAndDelete(request.params.id);

    if (!product) {
      response.status(404).json({
        success: false,
        message: "Product not found"
      });
      return;
    }

    response.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

export const stockIn = async (request, response, next) => {
  try {
    const { quantity } = request.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      response.status(400).json({
        success: false,
        message: "Quantity must be a positive integer"
      });
      return;
    }

    if (!isValidProductId(request.params.id)) {
      response.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
      return;
    }

    const product = await Product.findById(request.params.id);

    if (!product) {
      response.status(404).json({
        success: false,
        message: "Product not found"
      });
      return;
    }

    product.stock += quantity;
    await product.save();

    response.json({
      success: true,
      data: addStatus(product)
    });
  } catch (error) {
    next(error);
  }
};

export const stockOut = async (request, response, next) => {
  try {
    const { quantity } = request.body;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      response.status(400).json({
        success: false,
        message: "Quantity must be a positive integer"
      });
      return;
    }

    if (!isValidProductId(request.params.id)) {
      response.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
      return;
    }

    const product = await Product.findById(request.params.id);

    if (!product) {
      response.status(404).json({
        success: false,
        message: "Product not found"
      });
      return;
    }

    if (quantity > product.stock) {
      response.status(400).json({
        success: false,
        message: "Stock out quantity cannot exceed available stock"
      });
      return;
    }

    product.stock -= quantity;
    await product.save();

    response.json({
      success: true,
      data: addStatus(product)
    });
  } catch (error) {
    next(error);
  }
};
