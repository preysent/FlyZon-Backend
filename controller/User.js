const { validationResult } = require('express-validator'); // validating req
const user = require('../modals/user')
const bcrypt = require('bcrypt')    // incription of password
const jwt = require('jsonwebtoken')  // auth token
const Jwt_Str = process.env.JWT_STR   // secrit auth string


exports.createUser =  async (req, res) => {
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
  }


  exports.loginUser =  async (req, res) => {

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
  }


  exports.getUser = async (req, res) => {

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
  }