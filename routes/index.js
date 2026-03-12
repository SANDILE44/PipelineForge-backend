const express = require("express")
const router = express.Router()

const searchRoutes = require("./search")

router.use("/",searchRoutes)

module.exports = router
