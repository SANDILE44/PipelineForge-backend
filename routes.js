const express = require("express")
const router = express.Router()

const { searchBusinesses } = require("./services/searchBusinesses")


// search businesses
router.get("/search", async (req,res)=>{

const industry = req.query.industry
const city = req.query.city

const results = await searchBusinesses(industry,city)

res.json(results)

})


// save lead
router.post("/lead",(req,res)=>{

const lead = req.body

console.log("Saved lead:",lead)

res.json({
message:"Lead stored",
lead
})

})

module.exports = router