const axios = require("axios")

async function extractContactInfo(baseUrl){

let email = ""
let phone = ""
let whatsapp = ""

const pages = [
"",
"/contact",
"/contact-us",
"/about",
"/about-us",
"/team",
"/support"
]

for(const page of pages){

try{

const url = baseUrl.replace(/\/$/,"") + page

const response = await axios.get(url,{
timeout:5000,
headers:{
"User-Agent":"Mozilla/5.0"
}
})

const html = response.data

// EMAIL
if(!email){
const emailMatch = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)

if(emailMatch){
email = emailMatch[0].trim()
}
}

// PHONE (South Africa friendly)
if(!phone){
const phoneMatch = html.match(/(\+27|0)[0-9\s\-]{8,}/)

if(phoneMatch){
phone = phoneMatch[0].replace(/\s+/g," ").trim()
}
}

// WHATSAPP
if(!whatsapp){
const whatsappMatch = html.match(/wa\.me\/(\d+)|api\.whatsapp\.com\/send\?phone=(\d+)/)

if(whatsappMatch){
whatsapp = whatsappMatch[1] || whatsappMatch[2]
}
}

}catch(err){
continue
}

if(email && phone && whatsapp){
break
}

}

return {
email,
phone,
whatsapp
}

}

module.exports = extractContactInfo

