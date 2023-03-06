const router = require("express").Router()

const User = require("../models/User.model")

const uploaderMiddleware = require("../middlewares/uploader.middleware")

router.get("/", (req, res, next) => {

    User
        .find()
        .select({ name: 1 })
        .sort({ name: 1 })
        .then(users => res.json(users))
        .catch(err => next(err))
})

router.put("/:id/edit", (req, res, next) => {

    const { id } = req.params
    const { name, lastName, avatar } = req.body

    User
        .findByIdAndUpdate(id, { name, lastName, avatar }, { new: true })
        .then(user => res.json(user))
        .catch(err => next(err))
})

router.delete("/:id/delete", (req, res, next) => {

    const { id } = req.params

    User
        .findByIdAndDelete(id)
        .then(user => res.json("User deleted succesfully"))
        .catch(err => next(err))
})

router.get("/:id", (req, res, next) => {

    const { id } = req.params

    User
        .findById(id)
        .then(user => res.json(user))
        .catch(err => next(err))
})




module.exports = router