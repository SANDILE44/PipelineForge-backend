const axios = require("axios")
const cheerio = require("cheerio")

async function searchMapsBusinesses(industry, city){

let businesses = []
const seen = new Set()

const query = `${industry} in ${city}`

const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=en`

try{

const response = await axios.get(url,{
headers:{ "User-Agent":"Mozilla/5.0" }
})

const $ = cheerio.load(response.data)

// Bing map style cards
$(".b_entityTP, .b_algo").each((i,el)=>{

const name = $(el).find("h2").text().trim()
const website = $(el).find("a").attr("href")

if(!name || !website) return

if(seen.has(website)) return
seen.add(website)

businesses.push({
name,
website,
email:"",
phone:"",
whatsapp:"",
industry,
city
})

})

}catch(err){

console.log("Maps search error:",err.message)

}

return businesses

}

module.exports = searchMapsBusinesses