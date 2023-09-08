const Product = require('../modals/product')
const User = require('../modals/user')

exports.getSellerProducts =  async (req, res) => {
    try {

        // checking is the seller true
        const Seller = await User.findById(req.user.id).select('seller')
        if (!Seller.seller) return res.status(400).json({ msg: "seller not valid" })

        // finding the seller products
        const products = await Product.find({ sellerId: req.user.id })
        res.json({status:true,productList:products})

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
}