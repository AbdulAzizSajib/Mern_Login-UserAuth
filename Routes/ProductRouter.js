import express from "express";

import {
  addProduct,
  deleteProduct,
  ProductList,
  ProductListById,
  updateProduct,
} from "../Controllers/ProductController.js";
import adminAuth from "../Middlewares/adminAuth.js";
import upload from "../Middlewares/multer.js";

const ProductRouter = express.Router();

//CRUD Operations
ProductRouter.post(
  "/add",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  addProduct
);
ProductRouter.delete("/delete/:id", deleteProduct);
ProductRouter.get("/list", ProductList);
ProductRouter.get("/list/:id", ProductListById);
ProductRouter.put(
  "/update/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  updateProduct
);

export default ProductRouter;
