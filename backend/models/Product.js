// import Category from "./Category";
const mongoose = require("mongoose");
const { Schema } = mongoose;
// const category = require("./Category");

const productSchema = Schema({
  user: {
    // type: Schema.Types.ObjectId,
    type: String,
    ref: "User",
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  cat_id: {
    // type: String,
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
