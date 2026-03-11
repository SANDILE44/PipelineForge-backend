async function searchBusinesses(industry,city){

let businesses = []

for(let i=1;i<=10;i++){

businesses.push({

name:`${industry} Company ${i}`,
email:`contact${i}@${industry}.com`,
phone:`+27 60 000 000${i}`,
website:`https://${industry}${i}.com`,
industry:industry,
city:city

})

}

return businesses

}

module.exports = { searchBusinesses }
