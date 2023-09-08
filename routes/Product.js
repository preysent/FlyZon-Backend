const express = require('express')
const router = express.Router();

//importing middlewere function to get user id
const getUserId = require('../Middlewere/getUserId')

//validation of request
const { body } = require('express-validator');

const {createNewProduct, updateProduct, deleteProduct, fetchProductByCategory, getOneProduct, searchProduct} = require('../controller/Product')

// Route 1: adding new product to the list
router.post('/', getUserId, [

    body('productTitle').isLength({ min: 5 }),
    body('description').notEmpty().isArray(),
    body('price').notEmpty(),
    body('brand').notEmpty(),
    body('category').notEmpty(),
    body('stock').notEmpty(),
    body('images').notEmpty().isArray(),


],createNewProduct)




// Route 2: updating the existing product
router.put('/:id', getUserId, [

    body('productTitle').isLength({ min: 5 }),
    body('description'),
    body('price').isInt(),
    body('brand'),
    body('category'),
    body('stock').isInt(),
    body('images'),


], updateProduct)



// Route 3: deleting the existing product
router.delete('/delete/:id', getUserId, deleteProduct)



// Route 4: get product by category
router.get('/fetch/:category', fetchProductByCategory)



// Route 5: get one single product
router.get('/:id',getOneProduct)



// Route 6: search product from db /search/searchString
router.get('/search/:searchStr', searchProduct)

module.exports = router