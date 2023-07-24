require('dotenv').config() // use to excess envirement variable
const express = require('express')
const dbConnect = require('./db')
const app = express()
const port = process.env.API_PORT
const host = process.env.API_HOST

// database connection
dbConnect().catch(err => console.log(err));


var cors = require('cors')// cors is use to 

//middlewere - use to get request in browser
app.use(cors())

//middlewere to send responce in json
app.use(express.json())


//avalible routes == it use theat endpoing to response
app.use('/api/user', require('./routes/auth'));
app.use('/api/product', require('./routes/Product')) 
app.use('/api/order', require('./routes/Order')) 
app.use('/api/cart', require('./routes/Cart'))

  
app.listen(port, () => {
  console.log(`Example app listening on http://${host}:${port}`)
})