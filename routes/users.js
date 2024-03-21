const express = require("express");
const bcrypt = require("bcrypt");
const {auth} = require("../middlewares/auth")
const {UserModel,validateUser,validateLogin,createToken} = require("../models/userModel");

const router = express.Router();

// Define the router
router.get("/",(req,res) => {
  res.json({msg:"users endpoint"})
})



//Middle function to validate the user, password:0 means that the password will not be exposed
// as oppose to other paramaters
router.get("/userInfo", auth ,async(req,res) => {

  try{
    const user = await UserModel.findOne({_id:req.tokenData._id},{password:0})
    res.json(user);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
  
})


//A router that registers a user.
router.post("/",async(req,res) => {
  const validBody = validateUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const user = new UserModel(req.body);
//Encryption with the library bcrypt
//10 is the level of encryption
//One can have higher levels of encryption but it takes way more resources.
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
//Hiding from the encyption level from the customer's side
    user.password = "****";
    res.status(201).json(user);
  }
  //Code 11000 means that the email is already in the system
  catch(err){
    if(err.code == 11000){
      return res.status(400).json({msg:"Email already in system",code:11000})
    }
    console.log(err);
    res.status(502).json({err})
  }
})


//A login router
router.post("/login",async(req,res) => {
  const validBody = validateLogin(req.body);
  //If page does not exist
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    //Check if the email sent in the body exists in the db.
    const user = await UserModel.findOne({email:req.body.email})
    if(!user){
      return res.status(401).json({err:"Email not in system"});
    }
    //Check if the encrypted password matches the password coming from the customer in the body.
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass){
      return res.status(401).json({err:"password not match"});
    }
    const token = createToken(user._id, user.role);
    // Send a token to the customer
    res.json({token})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


// export default
module.exports = router;