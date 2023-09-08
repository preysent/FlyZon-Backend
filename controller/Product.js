const product = require('../modals/product')
const { validationResult } =  require('express-validator')

exports.createNewProduct =  async (req, res) => {
    try {
        const errors = validationResult(req);
        // if we get any validation error
        if (!errors.isEmpty()) {
            return res.send({ errors: errors.array() });

        }

        //Checking if it user then return invalid
        if (!req.user.seller) {
            return res.json({ msg: "invalid user" })
        }


        const { productTitle, description, price, brand, category, stock, images } = req.body
        const sellerId = req.user.id

        const newProduct = await product.create({
            productTitle,
            sellerId,
            description,
            price,
            brand,
            category,
            stock,
            images
        })

        // res.json({ msg: "product created" })
        return res.json({ status: true })

    } catch (err) {
        res.send({ msg: "some error accour" })
    }
}



exports.updateProduct = async (req, res) => {

    try {
        //Checking if it user then return invalid 
        if (!req.user.seller) {
            return res.json({ msg: "invalid user" })
        }


        // getting the product from db
        let productToUpdate = await product.findById(req.params.id)
        if (!productToUpdate) return res.json({ msg: "product not found" })


        // checking the user is same
        if (!productToUpdate.sellerId === req.user.id) {
            return res.json({ msg: "user dose not match" })
        }


        //getting value for updation
        const { productTitle, description, price, brand, category, stock, images } = req.body

        const ProductFilds = {}
        if (productTitle) ProductFilds.productTitle = productTitle
        if (description) ProductFilds.description = description
        if (price) ProductFilds.price = price
        if (brand) ProductFilds.brand = brand
        if (category) ProductFilds.category = category
        if (stock) ProductFilds.stock = stock
        if (images) ProductFilds.images

        const newProduct = await product.findByIdAndUpdate(req.params.id, { $set: ProductFilds }, { new: true })

      
       return res.json({ status: true })

    } catch (err) {
        res.send({ err })
    }
}



exports.deleteProduct = async (req, res) => {

    //Checking if it user then return invalid 
    if (req.user.seller) {
        return res.json({ msg: "invalid user" })
    }


    try {
        // getting the product from db
        let productToUpdate = await product.findById(req.params.id)
        if (!productToUpdate) return res.json({ msg: "product not found" })


        // checking the user is same
        if (!productToUpdate.sellerId === req.user.id) {
            return res.json({ msg: "user dose not match" })
        }



        const newProduct = await product.findByIdAndDelete(req.params.id);

        res.json(newProduct)

    } catch (err) {
        res.send({ err })
    }
}

exports.fetchProductByCategory = async (req, res) => {
    try {
        // getting the product from db
        let products = await product.find({ category: req.params.category })

        if (!products || products.length == 0)
            return res.json({ msg: "product not found" })

        res.json(products)

    } catch (err) {
        res.send({ err })
    }
}

exports.getOneProduct =  async (req, res) => {

    try {
        // getting the product details
        const Product = await product.findById({ _id: req.params.id })

        res.json(Product)

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }

}

exports.searchProduct = async (req, res) => {
    try {
        // creating regular expression for search | not case sencitive
        const sr = RegExp(req.params.searchStr, "i")
        const products = await product.find({ productTitle: sr })
        res.json(products)
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
}