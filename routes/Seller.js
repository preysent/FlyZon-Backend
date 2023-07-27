const express = require('express')
const Product = require('../modals/product')
const User = require('../modals/user')
const router = express.Router();

//importing middlewere function to get user id
const getUserId = require('../Middlewere/getUserId')

//validation of request
// const { body, validationResult } = require('express-validator');




// Route 1: get product of a perticuler seller

router.get('/products', getUserId, async (req, res) => {
    try {

        // checking is the seller true
        const Seller = await User.findById(req.user.id).select('seller')
        if (!Seller.seller) return res.status(400).json({ msg: "seller not valid" })

        // finding the seller products
        const products = await Product.find({ sellerId: req.user.id }).select('productTitle').select('category').select('price').select('stock')
        res.json({status:true,productList:products})

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
})

module.exports = router