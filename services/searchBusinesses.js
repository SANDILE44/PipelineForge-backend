const axios = require("axios")
const cheerio = require("cheerio")
const extractContactInfo = require("./extractContactInfo")

function cleanDomain(url){
  try{
    const u = new URL(url)
    return u.origin
  }catch{
    return null
  }
}

async function searchBusinesses(industry, city){

let businesses = []
const seen = new Set()

const queries = [

`${industry} company in ${city}`,
`${industry} services ${city}`,
`${industry} business ${city}`,
`${industry} companies near ${city}`,
`${industry} firms ${city}`,
`${industry} providers ${city}`

]

// domains we block
const blockedDomains = [

"yellowpages",
"infoisinfo",
"firmania",
"procompare",
"cylex",
"thinklocal",
"netpages",
"rentechdigital",
"facebook",
"linkedin",
"instagram",
"youtube",
"twitter",
"pinterest",
"reddit",
"wikipedia",
"indeed",
"glassdoor",
"blog",
"news",
"article"

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
if(!website.startsWith("http")) continue

// decode bing redirect
if(website.includes("bing.com")){
const match = website.match(/u=a1([^&]+)/)

if(match){
try{
website = Buffer.from(match[1],"base64").toString("utf8")
}catch{}
}
}

// clean domain
website = cleanDomain(website)
if(!website) continue

// block junk domains
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

// delay to avoid blocking
await new Promise(r=>setTimeout(r,700))

// extract contact info
const contact = await extractContactInfo(website)

businesses.push({

name,
website,
email: contact.email || "",
phone: contact.phone || "",
whatsapp: contact.whatsapp || "",
industry,
city

})

if(businesses.length >= 120){
return businesses
}

}

}

}

}catch(err){

console.log("Search error:",err.message)

}

return businesses

}

module.exports = searchBusinesses