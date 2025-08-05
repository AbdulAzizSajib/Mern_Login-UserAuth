export const addProduct = (req, res) => {
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
    const image2 = req.files.image2 && req.files.image1[0];

    console.log(req.files);
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteProduct = (req, res) => {};
export const ProductList = (req, res) => {
  res.json({ name: "product list" });
};
export const ProductListById = (req, res) => {};
export const updateProduct = (req, res) => {};
