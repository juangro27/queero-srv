const router = require("express").Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const User = require('../models/User.model.js')
const uploaderMiddleware = require("../middlewares/uploader.middleware")

const { verifyToken } = require("../middlewares/verifyToken")


router.post('/signup', uploaderMiddleware.single('avatar'), (req, res, next) => {
    const { name, lastName, avatar, email, password } = req.body

    if (name.length < 2) {
        res.status(400).json({ errorMessages: ["Name must be have at least 3 characters."] })
        return
    }
    if (lastName.length < 2) {
        res.status(400).json({ errorMessages: ["Lastname must be have at least 3 characters."] })
        return
    }
    if (password.length < 3) {
        res.status(400).json({ errorMessages: ["Password must be have at least 4 characters."] })
        return
    }

    const salt = bcrypt.genSaltSync(saltRounds)
    const hashedPassword = bcrypt.hashSync(password, salt)

    User.create({ email, password: hashedPassword, name, avatar, lastName })

        .then(() => res.sendStatus(201))
        .catch(err => next(err))
})


router.post('/login', (req, res, next) => {

    const { email, password } = req.body;

    if (email === '' || password === '') {
        res.status(400).json({ errorMessages: ["Provide email and password."] });
        return;
    }

    User
        .findOne({ email })
        .then((foundUser) => {

            if (!foundUser) {
                res.status(401).json({ errorMessages: ["User not found."] })
                return;
            }

            if (bcrypt.compareSync(password, foundUser.password)) {

                const { _id, email, name, lastName, avatar, role } = foundUser;
                const payload = { _id, email, name, lastName, avatar, role }

                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                )

                res.status(200).json({ authToken })
            }
            else {
                res.status(401).json({ errorMessages: ["Incorrect password"] });
            }

        })
        .catch(err => next(err));
})

router.get('/verify', verifyToken, (req, res, next) => {
    res.json(req.payload)
})


module.exports = router