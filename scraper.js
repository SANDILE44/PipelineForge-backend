const axios = require("axios")
const cheerio = require("cheerio")

async function searchBusinesses(industry, city){

let businesses = []

try{

// search query
const query = `${industry} ${city}`

// fetch search results page
const response = await axios.get(`https://www.bing.com/search?q=${encodeURIComponent(query)}`)

const $ = cheerio.load(response.data)

// collect websites
let links = []

$("li.b_algo h2 a").each((i,el)=>{
if(i < 10){
links.push($(el).attr("href"))
}
})

for(let link of links){

try{

const page = await axios.get(link)

const html = page.data

// find emails in page
const emailMatch = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig)

let email = emailMatch ? emailMatch[0] : "Not found"

businesses.push({
name: link.split("//")[1],
email: email,
phone: "Not found",
website: link,
industry: industry,
city: city
})

}catch(err){

businesses.push({
name: link.split("//")[1],
email: "Not found",
phone: "Not found",
website: link,
industry: industry,
city: city
})

}

}

}catch(error){

console.log(error)

}

return businesses

}

module.exports = { searchBusinesses }