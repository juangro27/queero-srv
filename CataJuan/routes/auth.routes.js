const router = require("express").Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const User = require('../models/User.model.js')


router.post('/signup', (req, res, next) => {
    const { name, lastName, avatar, email, password } = req.body

    if (name.length < 2) {
        res.status(400).json({ message: "Name must be have at least 3 characters." })
        return
    }
    if (lastName.length < 2) {
        res.status(400).json({ message: "Lastname must be have at least 3 characters." })
        return
    }
    if (password.length < 3) {
        res.status(400).json({ message: "Password must be have at least 4 characters." })
        return
    }
    User
        .findOne({ email })
        .then(foundUser => {
            if (foundUser) {
                res.status(400).json({ message: "User already exists." })
                return
            }
            const salt = bcrypt.genSaltSync(saltRounds)
            const hashedPassword = bcrypt.hashSync(password, salt)

            return User.create({ email, password: hashedPassword, name, lastName })
        })
        .then(() => res.sendStatus(201))
        .catch(err => next(err))
})






module.exports = router