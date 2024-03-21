const express = require("express");
const router = express.Router();

router.get("/",async(req,res)=>{
    res.json("Index Final Project Works");
})

module.exports = router;