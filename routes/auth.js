const express = require('express')
const router = express.Router();


//validation of request
const { body } = require('express-validator');

//importing middlewere function to get user id
const getUserId = require('../Middlewere/getUserId')

const {createUser, loginUser, getUser} = require('../controller/User')



// Route 1: createing a user 
router.post('/create', [

  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail(),
  body('number').notEmpty({min:10}),
  body('password').isLength({ min: 5 }),
  body('address.street').notEmpty(),
  body('address.city').notEmpty(),
  body('address.state').notEmpty(),
  body('address.country').notEmpty(),
  body('address.zipCode').notEmpty(),

], createUser)




// Route 2: login the user 
router.post('/login', [

  body('email').isEmail(),
  body('password').isLength({ min: 5 }),

],loginUser)




// Route 3: get logged in user detail's 
router.post('/getUser', getUserId, getUser)

module.exports = router;