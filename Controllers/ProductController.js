import productModel from "../Models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

export const addProduct = async (req, res) => {
  try {
    const {
      _type,
      name,
      price,
      discountedPercentage,
      category,
      brand,
      badge,
      isAvailable,
      offer,
      description,
      tags,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];

    if (!name) {
      return res.send({ success: false, message: "Product name is required" });
    }
    if (!price) {
      return res.send({ success: false, message: "Product price is required" });
    }
    if (!category) {
      return res.send({
        success: false,
        message: "Product category is required",
      });
    }
    if (!description) {
      return res.send({
        success: false,
        message: "Product description is required",
      });
    }

    const images = [image1, image2].filter((item) => item !== undefined);
    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    let parsedTags;
    try {
      parsedTags = JSON.parse(tags);
    } catch (error) {
      parsedTags = tags ? tags.split(", ").map((tag) => tag.trim()) : [];
    }

    const productData = {
      _type: _type || "",
      name,
      images: imageUrl,
      price: Number(price),
      discountedPercentage: Number(discountedPercentage),
      category,
      brand: brand || "",
      badge: badge === true ? true : false,
      isAvailable: isAvailable === true ? true : false,
      offer: offer === true ? true : false,
      description: description || "",
      tags: tags ? parsedTags : [],
    };

    const product = new productModel(productData);
    product.save();

    return res.send({
      success: true,
      message: `${name} added and saved to db successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await productModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Products
export const ProductList = async (req, res) => {
  try {
    const products = await productModel.find({});

    return res.json({
      success: true,
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Product by ID
export const ProductListById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    return res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      _type,
      name,
      price,
      discountedPercentage,
      category,
      brand,
      badge,
      isAvailable,
      offer,
      description,
      tags,
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];

    let updatedImages = [];

    if (image1 || image2) {
      const images = [image1, image2].filter(Boolean);
      updatedImages = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    let parsedTags;
    try {
      parsedTags = JSON.parse(tags);
    } catch (error) {
      parsedTags = tags ? tags.split(", ").map((tag) => tag.trim()) : [];
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        _type: _type || "",
        name,
        price: Number(price),
        discountedPercentage: Number(discountedPercentage),
        category,
        brand: brand || "",
        badge: badge === true ? true : false,
        isAvailable: isAvailable === true ? true : false,
        offer: offer === true ? true : false,
        description: description || "",
        ...(updatedImages.length && { images: updatedImages }),
        tags: tags ? parsedTags : [],
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.json({ success: false, message: "Product not found" });
    }

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
