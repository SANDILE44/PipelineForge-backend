const axios = require("axios")
const cheerio = require("cheerio")

async function searchBusinesses(industry, city){

 const query = `${industry} companies in ${city}`
 const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`

 const response = await axios.get(url)

 const $ = cheerio.load(response.data)

 const businesses = []

 $("li.b_algo h2 a").each((i,el)=>{

  const name = $(el).text()
  const website = $(el).attr("href")

  businesses.push({
   name,
   website,
   industry,
   city
  })

 })

 return businesses
}

module.exports = { searchBusinesses }