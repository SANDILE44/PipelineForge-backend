const express = require("express")
const router = express.Router()

const { searchBusinesses } = require("../services/searchBusinesses")

router.get("/search", async (req,res)=>{

try{

const industry = req.query.industry
const city = req.query.city

if(!industry || !city){

return res.json({
error:"industry and city required"
})

}

const results = await searchBusinesses(industry,city)

res.json(results)

}catch(err){

console.log(err)

res.status(500).json({
error:"server error"
})

}

})

module.exports = router
