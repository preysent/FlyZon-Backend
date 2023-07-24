const mongoose = require('mongoose');
const { Schema } = mongoose;



// Product schema
const productSchema = new Schema({
  
  // sellerID will use for varify the seller of the product
  sellerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  productTitle: String,
  description: [String],
  price: Number,
  brand: String,
  category: String,
  stock: Number,
  images: [String]
});




module.exports =  mongoose.model('Product', productSchema);