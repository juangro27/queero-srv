const router = require("express").Router();

const countriesRoutes = require("./countries.routes")
router.use("/countries", countriesRoutes)

const postsRoutes = require("./posts.routes")
router.use("/posts", postsRoutes)

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const userRoutes = require("./user.routes")
router.use("/users", userRoutes)

const commentsRoutes = require("./comments.routes")
router.use("/comments", commentsRoutes)

module.exports = router;
