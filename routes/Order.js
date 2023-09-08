const express = require('express')
const router = express.Router()

// middlewere function to verify user
const getUserId = require('../Middlewere/getUserId')

// importing express-validoter to validate request data
const { body } = require('express-validator');
const { createOrder, getOrderDetails } = require('../controller/Order')





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

], createOrder )



// Route 2. getting order detals 
router.get('/:oId', getUserId, getOrderDetails)

module.exports = router;