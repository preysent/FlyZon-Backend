const User = require('../modals/user');
const Product = require('../modals/product');
const {validationResult} = require('express-validator')

exports.addToCart = async (req, res) => {
    try {
        // Validation, check if there are any validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //destructuring the values
        const { productId, quantity=1 } = req.body
        
        // Checking if the product exists
        const productExist = await Product.findById(productId);
        if (!productExist) {
            return res.status(404).json({ error: "Product is not available" });
        }

        // Add new cart element
        const newCartItem = {
            productId: productId,
            quantity: quantity
        };


        // Find the user and check if the cart is already full
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "Invalid user" })

        // cheking the product already exist in cart | true if elvery elm setisfy
        let notInCart = user.cart.every(elm => elm.productId != productId)


        // if product is already in cart then only update the quantity
        if (!notInCart)
            user.cart.forEach(elm => {
                if (elm.productId == productId)
                    elm.quantity += parseInt(quantity)
            })

        // if product not found in cart
        if (notInCart) {

            if (user.cart.length >= 10)  // Set the cart size limit
                return res.status(400).json({ error: "Cart is already full" });


            // Update the user's cart by adding the new element and amount
            user.cart.push(newCartItem)
        }

        await user.save();
        res.json(user);

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to add Cart' });
    }
}

exports.getAllCartItems = async (req, res) => {
    try {

        // getting user from db
        findUser = await User.findById(req.user.id).select('cart')
        if (!findUser)
            return res.status(404).json({ error: "User is not valid " });


        const { cart } = findUser

        //is cart is empty 
        if (cart.length < 1) {
            return res.status(400).json({ error: "Cart is empty" });
        }
        
        // till all Promise resolve await 
        const cartList = await Promise.all(
            //return promises of product details
            cart.map(async (elm) => {
            let product = await Product.findById(elm.productId)
            return { product, quantity: elm.quantity };
        })
        );


        res.json(cartList)

    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ error: 'Failed to get cart details' });
    }
}

exports.deleteCartItem = async (req, res) => {
    try {
        // Getting user from the database
        const user = await User.findById(req.user.id).select('cart');
        if (!user) {
            return res.status(404).json({ error: "User is not valid" });
        }

        const { cart } = user;

        // Check if the cart is empty
        if (cart.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        // Filter out the product with the given productId
        const newCart = cart.filter(elm => elm.productId != req.params.productId);

        // Update the cart
        user.cart = newCart;
        await user.save();
        res.json(newCart);

    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ error: 'Failed to delete product from cart' });
    }
}