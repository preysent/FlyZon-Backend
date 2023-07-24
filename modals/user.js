const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({

  firstName: String,
  lastName: String,
  email: String,
  password: String,
  number: String,
  seller: {
    type: Boolean,
    default: false
  },

  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },

  cart: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number
  }],

  orders: [{
    oId: {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    },
    oAmount: Number,
    oStatus: String
  }]
});


module.exports = mongoose.model('User', userSchema);
