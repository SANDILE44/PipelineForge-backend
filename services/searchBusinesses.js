kconst axios = require("axios")
const cheerio = require("cheerio")

async function extractContactInfo(url){

let email = ""
let phone = ""

try{

const res = await axios.get(url,{timeout:5000})
const html = res.data

const emailMatch = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
const phoneMatch = html.match(/(\+?\d[\d\s\-]{7,})/)

if(emailMatch) email = emailMatch[0]
if(phoneMatch) phone = phoneMatch[0]

}catch(err){
console.log("Contact scrape failed:",url)
}

return {email,phone}

}

async function searchBusinesses(industry,city){

let businesses = []

try{

const query = `${industry} companies in ${city}`
const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`

const response = await axios.get(url)
const $ = cheerio.load(response.data)

$("li.b_algo").each(async (i,el)=>{

const name = $(el).find("h2").text()
const website = $(el).find("a").attr("href")

if(
name &&
website &&
!website.includes("bing.com") &&
!website.includes("africanadvice") &&
!website.includes("cylex") &&
!website.includes("procompare")
){

const contact = await extractContactInfo(website)

businesses.push({
name,
website,
email:contact.email,
phone:contact.phone,
industry,
city
})

}

})

}catch(error){
console.log("Search error:",error.message)
}

return businesses

}

module.exports = {searchBusinesses}
