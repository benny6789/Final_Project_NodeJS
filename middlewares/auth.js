const jwt = require("jsonwebtoken");
require("dotenv").config()
//Middleware function

exports.auth = (req,res,next) => {
  //Collects the user's token from the header
  const token = req.header("x-api-key");
  // If token is not sent then error message
  if(!token){
    return res.status(401).json({err:"You need to send a token!! "});
  }
  try{
    //Try to decipher the token, if it does the user will have the ID in the token
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET);
    req.tokenData = decodeToken
    // Success and goes to the next function
    next()
  }
  catch(err){
    return res.status(401).json({err:"Token invalid or expired!"});
  }
}


//validation function
exports.authAdmin = (req,res,next) => {
  //Collects the user's token from the header
  const token = req.header("x-api-key");
  // If token is not sent then error message
  if(!token){
    return res.status(401).json({err:"You need to send token!"});
  }
  try{
    //Try to decipher the token, if it does the user will have the ID in the token
    const decodeToken = jwt.verify(token,process.env.TOKEN_SECRET);
    //check if usre is not admin and sends an error message
    if(decodeToken.role != "admin" && decodeToken.role != "superadmin"){
      return res.status(401).json({err:"Just admin can be in this endpoint"});
    }
 
    req.tokenData = decodeToken
    // Success and goes to the next function
    next()
  }
  catch(err){
    return res.status(401).json({err:"Token invalid or expired!!"});
  }
}