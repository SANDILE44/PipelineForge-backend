const express = require("express")

const searchBusinesses = require("../services/searchBusinesses")
const searchMapsBusinesses = require("../services/searchMapsBusinesses")
const industries = require("../services/industries")
const { addOutreach, getOutreach } = require("../services/outreachStore")

const router = express.Router()



// BUSINESS SEARCH
router.get("/search", async (req, res) => {

try{

const { industry, city } = req.query

if(!industry || !city){
return res.status(400).json({ error: "industry and city required" })
}

const results = await searchBusinesses(industry, city)

res.json(results)

}catch(err){

console.log("Search error:", err.message)
res.status(500).json({ error: "Search failed" })

}

})



// MAPS BUSINESS SEARCH
router.get("/maps", async (req, res) => {

try{

const { industry, city } = req.query

if(!industry || !city){
return res.status(400).json({ error: "industry and city required" })
}

const results = await searchMapsBusinesses(industry, city)

res.json(results)

}catch(err){

console.log("Maps error:", err.message)
res.status(500).json({ error: "Maps search failed" })

}

})



// DISCOVER MULTIPLE INDUSTRIES
router.get("/discover", async (req,res)=>{

try{

const city = req.query.city

if(!city){
return res.status(400).json({ error:"city required" })
}

let results = []

for(const industry of industries){

const businesses = await searchBusinesses(industry, city)

results = results.concat(businesses)

}

res.json(results)

}catch(err){

console.log("Discover error:", err.message)
res.status(500).json({ error:"Discovery failed" })

}

})



// SAVE OUTREACH ACTION
router.post("/outreach",(req,res)=>{

try{

const data = req.body

addOutreach({
business:data.business,
industry:data.industry,
location:data.location,
contact:data.contact,
platform:data.platform,
status:"sent",
date:new Date()
})

res.json({ success:true })

}catch(err){

res.status(500).json({ error:"Failed to save outreach" })

}

})



// GET OUTREACH TRACKER
router.get("/outreach",(req,res)=>{

res.json(getOutreach())

})



module.exports = router