import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema({
  _type: { type: String },
  name: { type: String, require: true },
  image: { type: Array, require: true },
  price: { type: Number, require: true },
  discountedPercentage: { type: Number },
  category: { type: String, require: true },
  brand: { type: String },
  badge: { type: Boolean },
  isAvailable: { type: Boolean },
  offer: { type: Boolean },
  description: { type: String },
  tags: { type: Array },
});

const productModel = mongoose.model("product", ProductSchema);
export default productModel;
