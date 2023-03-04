const router = require("express").Router();

const countriesRoutes = require("./countries.routes")
router.use("/countries", countriesRoutes)

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

module.exports = router;
