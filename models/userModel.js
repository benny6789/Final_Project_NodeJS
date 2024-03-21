const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
//So we can communicate to an env file with hidden variables
require("dotenv").config();

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    //Defines if the user is a regular user or an admin
    role:{
        type:String, default:"user"
    }
},{timeseries:true})

exports.UserModel = mongoose.model("users",userSchema);

//Create token
exports.createToken = (user_id,role) => {
    //jwt.sign - create token
    const token = jwt.sign({_id:user_id,role},process.env.TOKEN_SECRET,
     {expiresIn:"60mins"});
     return token;
}

//validate the user creation
exports.validateUser = (_reqBody) => {
    const joiSchema = Joi.object({
        name:Joi.string().min(4).max(100).required(),
        email:Joi.string().min(2).max(100).required(),
        password:Joi.string().min(8).max(30).required()

    })
    return joiSchema.validate(_reqBody);
}

//validate the user login
exports.validateLogin = (_reqBody) => {
    const joiSchema = Joi.object({
        email:Joi.string().min(2).max(100).required(),
        password:Joi.string().min(8).max(30).required()

    })
    return joiSchema.validate(_reqBody);
}




