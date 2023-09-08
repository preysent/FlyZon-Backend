const express = require('express')
const router = express.Router();

//importing middlewere function to get user id
const getUserId = require('../Middlewere/getUserId');
const { getSellerProducts } = require('../controller/Seller');


// Route 1: get product of a perticuler seller
router.get('/products', getUserId,getSellerProducts)

module.exports = router