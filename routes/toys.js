const express = require("express");
const { auth } = require("../middlewares/auth");
const { validateToy, ToyModel } = require("../models/toyModel");
const router = express.Router();


router.get("/",async(req,res) => {
    // res.json("Toys Final Project Works");
    const limit = Math.min(req.query.limit,10) || 5;
    const skip = req.query.skip || 0
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1; 
  
    try{
      const data = await ToyModel
      .find({})
      .limit(limit)
      .skip(skip)
      .sort({[sort]:reverse})
      res.json(data); 
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })


  router.get("/search",async(req,res) => {
    try{
      const searchQ = req.query.s;
      // 
      // i - Makes sure there is no issue with case sensitivity
      const searchExp = new RegExp(searchQ,"i")
      const data = await ToyModel.find({$or:[{name:searchExp},{info:searchExp}]})
      .limit(10)
      .skip(10)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })


router.get("/category",async(req,res)=>{
    try{
        const data = await ToyModel.find({category}).limit(10)
        .skip(10)
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})
  
router.post("/",auth,async(req,res) => {
    const validBody = validateToy(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details)
    }
    try{
      const toy = new ToyModel(req.body);
      //Add to the record the user's ID with the token
      toy.user_id = req.tokenData._id;
      await toy.save();
      res.status(201).json(toy);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })



  router.put("/:id",auth,async(req,res) => {
    const validBody = validateToy(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details)
    }
    try{
      const id = req.params.id;
      //user_id makes sure only the user identified could update their record
      const data = await ToyModel.updateOne({_id:id,user_id:req.tokenData._id},req.body);
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  router.delete("/:id",auth,async(req,res) => {
    try{
      const id = req.params.id;
      let data;
      //If the user is admin he can delete other records and their own.
      if(req.tokenData.role == "admin" || req.tokenData.role == "superadmin"){
        data = await ToyModel.deleteOne({_id:id});
      }//Checks if the user is an admin wether it is the owner of the record
      else{
        data = await ToyModel.deleteOne({_id:id,user_id:req.tokenData._id});
      }
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  
  
  router.get("/price",async(req,res) => {
    const min = req.query.min || 0;
    const max = req.query.max || Infinity;
    try{
      const data = await ToyModel.find({price:{$gte:min,$lte:max}}).limit(10)
      .skip(10)
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  router.get("/single/:id",async(req,res)=>{
    try{
        const data = await ToyModel.findById({_id:id});
        res.json(data);

    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
  })

//return the amount of records in the collection
  router.get("/count",async(req,res) => {
    try{
      const limit = req.query.limit || 5;
      const count = await ToyModel.countDocuments({});
      res.json({count,pages:Math.ceil(count/limit)});
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  

module.exports = router;


