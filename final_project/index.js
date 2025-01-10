const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.headers['authorization'];
  
    // Check if token exists in the request header
    if (!token) {
      return res.status(403).json({ message: "Access denied, no token provided." });
    }
  
    // Verify the token
    jwt.verify(token, "secret_key", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
      }
  
      // Store the user information in the request object
      req.user = user;
  
      // Continue to the next middleware or route
      next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
