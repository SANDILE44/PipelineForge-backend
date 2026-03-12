const express = require("express")
const cors = require("cors")

const routes = require("./routes")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", routes)

app.get("/", (req, res) => {
  res.json({
    name: "PipelineForge API",
    status: "running"
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`PipelineForge running on port ${PORT}`)
})
