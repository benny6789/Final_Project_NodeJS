const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
  name: String,
  info: String,
  category: String,
  img_url: String,
  price: Number,
  // Has the ID of the person who add the rercord
  user_id:String
},{timestamps:true})
exports.ToyModel = mongoose.model("toys", schema)

exports.validateToy = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    info: Joi.string().min(5).max(999).required(),
    category: Joi.string().min(5).max(50).required(),
    img_url: Joi.string().min(2).max(400).allow(null, ""),
    price: Joi.number().min(1).max(9999).required()

  })
  return joiSchema.validate(_reqBody)
}


