const express = require('express')
const Order = require('../modals/order') //order monal
const Product = require('../modals/product')
const User = require('../modals/user')
const router = express.Router()

// middlewere function to verify user
const getUserId = require('../Middlewere/getUserId')

// importing express-validoter to validate request data
const { body, validationResult } = require('express-validator');





// Route 1: Order placing  |  here type indicate the is one order placing or cart items 
router.post('/:type', getUserId, [

    body('products').isArray({ min: 1 }),
    body('products.*.productId').notEmpty(), // importent  syntex
    body('products.*.quantity').isInt({ min: 1 }),
    body('totalAmount').notEmpty(),
    body('shippingAddress.street').notEmpty(),
    body('shippingAddress.city').notEmpty(),
    body('shippingAddress.state').notEmpty(),
    body('shippingAddress.country').notEmpty(),
    body('shippingAddress.zipCode').notEmpty(),

], async (req, res) => {

    try {
        // validation is there any validation error
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() ,body:req.body});
        }

        // destucturing the data form body
        const { products, totalAmount, shippingAddress } = req.body
        const userId = req.user.id

        // checking is user exist
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ msg: "User not valid" });


        // getting array of price and quantity 
        let productList = await Promise.all(
            products.map(async (product) => {

                let { productTitle, price, images } = await Product.findById(product.productId)
                    .select('productTitle')
                    .select('price')
                    .select('images')

                return { productId: product.productId, productTitle, price, images, quantity: product.quantity }
            })
        )

        // calculatting the total amount with price receved form db
        const totalAmountDB = productList.reduce((total, elm) => {
            return total + elm.price * elm.quantity
        }, 0)

        // Comparing my calculated amount with request amount
        if (totalAmount < totalAmountDB) {
            return res.status(400).json({ error: 'Failed to create order' })
        }


        //creating new order 
        const newOrder = await Order.create({
            userId, productList, totalAmount, shippingAddress
        })

        // updating user cart | if order type is cart
        if(req.params.type!="one")
        user.cart = []

        // creting order for user orders list 
        const oId = newOrder._id
        const oAmount = newOrder.totalAmount
        const oStatus = newOrder.status
        const order = { oId, oAmount, oStatus }

        await user.orders.push(order)
        await user.save()

        res.json({ status: "ok", oId: newOrder._id });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
})



// Route 2. getting order detals 
router.get('/:oId', getUserId, async (req, res) => {

    try {
        // checking user exists 
        const getUser = await User.findById(req.user.id)
        if (!getUser) return res.status(404).json({ msg: "User not valid" });

        // checking order exists
        const order = await Order.findById(req.params.oId)

        // checking is user correct  |  equals method uer to deep compaire of id's
        if (!getUser._id.equals(order.userId)) return res.status(401).json({ msg: "User not valid"});


        res.json({status:"ok",order})

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }


})

module.exports = router;