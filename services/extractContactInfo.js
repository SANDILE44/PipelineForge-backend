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

const emails = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)

if(emails && emails.length > 0){

email = emails.find(e =>
!e.includes("example") &&
!e.includes("test") &&
!e.includes("domain")
) || emails[0]

}

}

// PHONE
if(!phone){

const phones = html.match(/(\+27|0)[0-9\s\-]{8,}/g)

if(phones && phones.length > 0){
phone = phones[0].replace(/\s+/g," ").trim()
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