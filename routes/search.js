router.get("/search", async (req,res)=>{

try{

const industry = req.query.industry
const city = req.query.city

if(!industry || !city){

return res.json({
error:"industry and city required"
})

}

// run both searches
const webResults = await searchBusinesses(industry,city)
const osmResults = await searchOSMBusinesses(industry,city)

// merge results
const results = [...webResults, ...osmResults]

res.json(results)

}catch(err){

console.log(err)

res.status(500).json({
error:"server error"
})

}

})