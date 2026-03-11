const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/*
PipelineForge API
Simple backend to power outreach system
*/


// ROOT TEST
app.get("/", (req, res) => {

res.json({
name: "PipelineForge API",
status: "running"
});

});


// SEARCH BUSINESSES
app.get("/search", (req, res) => {

const industry = req.query.industry || "business";
const city = req.query.city || "city";

/*
Demo generator
Later you replace with real scraper
*/

let results = [];

for (let i = 1; i <= 10; i++) {

results.push({

name: `${industry} Company ${i}`,
email: `contact${i}@${industry}.com`,
phone: `+27 60 000 000${i}`,
website: `https://${industry}${i}.com`,
city: city,
industry: industry

});

}

res.json(results);

});



// SAVE LEAD
app.post("/lead", (req, res) => {

const lead = req.body;

console.log("New Lead:", lead);

res.json({
message: "Lead saved",
lead: lead
});

});



// START SERVER
app.listen(PORT, () => {

console.log(`PipelineForge server running on port ${PORT}`);

});
