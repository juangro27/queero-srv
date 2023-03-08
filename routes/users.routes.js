const router = require("express").Router()
const jwt = require('jsonwebtoken')
const User = require("../models/User.model")
const uploaderMiddleware = require("../middlewares/uploader.middleware")
const { verifyToken } = require("../middlewares/verifyToken")


router.get("/", verifyToken, (req, res, next) => {

    User
        .find()
        .select({ name: 1 })
        .sort({ name: 1 })
        .then(users => res.json(users))
        .catch(err => next(err))
})

router.get("/:id", verifyToken, (req, res, next) => {

    const { id } = req.params

    User
        .findById(id)
        .then(user => res.json(user))
        .catch(err => next(err))
})

router.put("/:id/edit", verifyToken, (req, res, next) => {

    const { id } = req.params
    const { name, lastName, avatar } = req.body

    User
        .findByIdAndUpdate(id, { name, lastName, avatar }, { new: true })
        .then(user => {
            const { _id, email, name, lastName, avatar } = user;
            const payload = { _id, email, name, lastName, avatar }
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: "6h" }
            )
            res.status(200).json({ authToken })
        })
        .then(user => res.json(user))
        .catch(err => next(err))
})

router.delete("/:id/delete", verifyToken, (req, res, next) => {

    const { id } = req.params

    User
        .findByIdAndDelete(id)
        .then(user => res.json("User deleted succesfully"))
        .catch(err => next(err))
})



module.exports = router