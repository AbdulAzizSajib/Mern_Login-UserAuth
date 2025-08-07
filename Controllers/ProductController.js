import { v2 as cloudinary } from "cloudinary";

import productModel from "./../Models/productModel.js";
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

    //set validation
    if (!name) {
      return res.send({ success: false, message: "Product Name is require!" });
    }
    if (!price) {
      return res.send({ success: false, message: "Product price is require!" });
    }
    if (!category) {
      return res.send({
        success: false,
        message: "Product category is require!",
      });
    }
    if (!description) {
      return res.send({
        success: false,
        message: "Product description is require!",
      });
    }
    // for image upload and validation

    let images = [image1, image2].filter((item) => item !== undefined);
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

    // ...
    const productData = {
      _type: _type ? _type : "",
      name,
      price: Number(price),
      discountedPercentage: Number(discountedPercentage),
      category,
      brand: brand ? brand : "",
      badge: badge === "true" ? true : false,
      isAvailable: isAvailable === "true" ? true : false,
      offer: offer === "true" ? true : false,
      description,
      tags: tags ? parsedTags : [],
      images: imageUrl,
    };

    console.log("productData post - >>>", productData);

    const product = new productModel(productData);
    product.save();

    return res.send({
      success: true,
      message: `${name} added and saved to DB successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Read - List of Products
export const ProductList = async (req, res) => {
  try {
    const products = await productModel.find();
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Read - Single Product by ID
export const ProductListById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found!",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product by ID
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       _type,
//       name,
//       price,
//       discountedPercentage,
//       category,
//       brand,
//       badge,
//       isAvailable,
//       offer,
//       description,
//       tags,
//     } = req.body;

//     const image1 = req.files.image1 && req.files.image1[0];
//     const image2 = req.files.image2 && req.files.image2[0];

//     let images = [image1, image2].filter((item) => item !== undefined);
//     let imageUrls = [];

//     if (images.length > 0) {
//       imageUrls = await Promise.all(
//         images.map(async (item) => {
//           let result = await cloudinary.uploader.upload(item.path, {
//             resource_type: "image",
//           });
//           return result.secure_url;
//         })
//       );
//     }

//     let parsedTags;
//     try {
//       parsedTags = JSON.parse(tags);
//     } catch (error) {
//       parsedTags = tags ? tags.split(", ").map((tag) => tag.trim()) : [];
//     }

//     const productData = {
//       _type: _type || "",
//       name,
//       price: Number(price),
//       discountedPercentage: Number(discountedPercentage),
//       category,
//       brand: brand || "",
//       badge: badge === "true",
//       isAvailable: isAvailable === "true",
//       offer: offer === "true",
//       description,
//       tags: tags ? parsedTags : [],
//       images: imageUrls.length > 0 ? imageUrls : undefined,
//     };

//     const product = await productModel.findByIdAndUpdate(id, productData, {
//       new: true,
//     });

//     if (!product) {
//       return res.json({
//         success: false,
//         message: "Product not found to update!",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Product updated successfully!",
//       product,
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await productModel.findById(id);

    if (!existingProduct) {
      return res.json({
        success: false,
        message: "Product not found!",
      });
    }

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

    // Validate required fields
    if (!name) {
      return res.send({ success: false, message: "Product Name is required!" });
    }
    if (!price) {
      return res.send({
        success: false,
        message: "Product price is required!",
      });
    }
    if (!category) {
      return res.send({
        success: false,
        message: "Product category is required!",
      });
    }
    if (!description) {
      return res.send({
        success: false,
        message: "Product description is required!",
      });
    }

    // Handle image updates
    let imageUrls = [...existingProduct.images]; // Keep existing images by default
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];

    if (image1 || image2) {
      const images = [image1, image2].filter((item) => item !== undefined);
      imageUrls = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }

    // Parse tags
    let parsedTags;
    try {
      parsedTags = tags ? JSON.parse(tags) : existingProduct.tags;
    } catch (error) {
      parsedTags = tags
        ? tags.split(", ").map((tag) => tag.trim())
        : existingProduct.tags;
    }

    // Prepare update data
    const updateData = {
      _type: _type || existingProduct._type,
      name: name || existingProduct.name,
      price: Number(price) || existingProduct.price,
      discountedPercentage:
        Number(discountedPercentage) || existingProduct.discountedPercentage,
      category: category || existingProduct.category,
      brand: brand || existingProduct.brand,
      badge:
        badge === "true"
          ? true
          : badge === "false"
          ? false
          : existingProduct.badge,
      isAvailable:
        isAvailable === "true"
          ? true
          : isAvailable === "false"
          ? false
          : existingProduct.isAvailable,
      offer:
        offer === "true"
          ? true
          : offer === "false"
          ? false
          : existingProduct.offer,
      description: description || existingProduct.description,
      tags: parsedTags,
      images: imageUrls,
    };

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    res.json({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product by ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found to delete!",
      });
    }

    await productModel.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
