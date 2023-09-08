const express = require('express');
const User = require('../modals/user');
const Product = require('../modals/product');
const router = express.Router();

// Middleware function to verify user
const getUserId = require('../Middlewere/getUserId');

// Importing express-validator to validate request data
const { body } = require('express-validator');

const {addToCart, getAllCartItems, deleteCartItem} = require('../controller/Cart')



// Route 1: add To Cart
router.post('/', getUserId, [
    body('productId').notEmpty(),
    body('quantity'),
], addToCart );


//Route 2: get all cart product with amount
router.get('/', getUserId, getAllCartItems )


// Route 3: delete product from cart list
router.delete('/:productId', getUserId, deleteCartItem);


module.exports = router;
