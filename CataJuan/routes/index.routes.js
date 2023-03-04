const router = require("express").Router();

const countriesRoutes = require("./countries.routes")
router.use("/countries", countriesRoutes)

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const userRoutes = require("./user.routes")
router.use("/users", userRoutes)

module.exports = router;
