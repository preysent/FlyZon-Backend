const express = require('express')
const user = require('../modals/user')
const router = express.Router();

//incription and hassing the password
const bcrypt = require('bcrypt');

//validation of request
const { body, validationResult } = require('express-validator');

//Json Web Token
const jwt = require('jsonwebtoken');
const Jwt_Str = process.env.JWT_STR

//importing middlewere function to get user id
const getUserId = require('../Middlewere/getUserId')



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

], async (req, res) => {

  try {

    const error = validationResult(req);
    // if we get any validation error
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }


    //  return res.json(req.body)
    //getting body elements by destructuring
    const { firstName, lastName, email, number, password, address, seller=false } = req.body


    //after validation we check is user already exist 
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists. Please try with another email." });
    }

    //generating salt and getting hash of the password
    let salt = await bcrypt.genSalt(10)
    let hash = await bcrypt.hash(password, salt)


    //creating user
    const createdUser = await user.create({
      firstName,
      lastName,
      email,
      number,
      password: hash,
      address,
      seller
    })


    //creating data for generating jwt
    const data = {
      user: {
        id: createdUser._id,
        seller: createdUser.seller
      }
    }

    //creating json web token
    var token = await jwt.sign(data, Jwt_Str);

    //sending authentication token
    res.json({login:true, token, User:createdUser })


  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
})






// Route 2: login the user 
router.post('/login', [

  body('email').isEmail(),
  body('password').isLength({ min: 5 }),

], async (req, res) => {

  try {
    const errors = validationResult(req);
    // if we get any validation error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    //getting body elements by destructuring
    const { email, password } = req.body


    //after validation we check is user already exist 
    let getUser = await user.findOne({ email: email })
    if (!getUser) return res.status(404).json({ msg: "User not found" });


    //compaire the given password and user's password
    const isPasswordValid = await bcrypt.compare(password, getUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }



    //creating data for generating jwt
    const data = {
      user: {
        id: getUser._id,
        seller: getUser.seller
      }
    }

    //creating json web token
    var token = await jwt.sign(data, Jwt_Str);

    //sending authentication token
    res.json({login:true, token })


  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
})





// Route 3: get logged in user detail's 
router.post('/getUser', getUserId, async (req, res) => {

  try {

    // it select all imformation of user other then password
    let User = await user.findById({ _id: req.user.id }).select('-password')

    if (User)
      res.json({ User, login: true })

    else
      res.status(404).json({ msg: "User not found", login: false });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error", login: false });
  }
})

module.exports = router;