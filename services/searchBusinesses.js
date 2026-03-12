const axios = require("axios")
const cheerio = require("cheerio")
const extractContactInfo = require("./extractContactInfo")

async function searchBusinesses(industry, city){

let businesses = []
const seen = new Set()

const queries = [
`${industry} company ${city} south africa`,
`${industry} services ${city} south africa`,
`${industry} firm ${city}`,
`${industry} business ${city}`,
`${industry} providers ${city}`,
`${industry} contractors ${city}`,
`${industry} companies near ${city}`,
`${industry} solutions ${city}`,
`${industry} logistics company ${city}`,
`${industry} transport company ${city}`
]

// directory sites we ignore
const blockedDomains = [
"yellowpages",
"infoisinfo",
"firmania",
"procompare",
"cylex",
"thinklocal",
"netpages",
"rentechdigital",

// news & social junk
"supplychaindive",
"wikipedia",
"forbes",
"cnn",
"bbc",
"nytimes",
"reddit",
"youtube",
"facebook",
"linkedin",
"twitter",
"instagram",
"zhihu"
]

try{

for(const query of queries){

for(let page = 0; page <= 30; page += 10){

const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&first=${page}`

const response = await axios.get(url,{
headers:{ "User-Agent":"Mozilla/5.0" }
})

const $ = cheerio.load(response.data)

const results = $("li.b_algo")

for(let i = 0; i < results.length; i++){

const el = results[i]

const name = $(el).find("h2").text().trim()
let website = $(el).find("a").attr("href")

if(!name || !website) continue

// decode bing redirect
if(website.includes("bing.com")){
const match = website.match(/u=a1([^&]+)/)

if(match){
try{
website = Buffer.from(match[1],"base64").toString("utf8")
}catch{}
}
}

// skip blocked domains
let blocked = false

for(const domain of blockedDomains){
if(website.includes(domain)){
blocked = true
break
}
}

if(blocked) continue

// remove duplicates
if(seen.has(website)) continue
seen.add(website)

// extract contacts
const contact = await extractContactInfo(website)

businesses.push({
name,
website,
email: contact.email,
phone: contact.phone,
whatsapp: contact.whatsapp,
industry,
city
})

// limit results
if(businesses.length >= 50){
return businesses
}

}

}

}

}catch(err){

console.log("Search error:", err.message)

}

return businesses

}

module.exports = searchBusinesses
