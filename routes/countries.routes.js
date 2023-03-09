const router = require("express").Router()
const Comment = require("../models/Comment.model")
const Country = require('../models/Country.model')
const { verifyToken } = require("../middlewares/verifyToken")



router.get('/', (req, res, next) => {

    Country
        .find()
        .then(countries => res.json(countries))
        .catch(err => next(err))

})

router.get('/names', (req, res, next) => {

    Country
        .find()
        .select({ name: 1 })
        .then(data => res.json(data))
        .catch(err => next(err))
})

router.get('/:id', (req, res, next) => {

    const { id } = req.params

    Country
        .findById(id)
        .populate({
            path: "comments",
            select: '-updatedAt',
            populate: {
                path: 'owner',
                select: '-__v -password -email -role -createdAt -updatedAt'
            },
        })
        .populate('posts', 'title owner')
        .then(country => res.json(country))
        .catch(err => next(err))

})

router.put('/:id/edit', verifyToken, (req, res, next) => {

    const { id } = req.params
    const {
        name,
        description,
        img,
        alpha3Code,
        discriminationProtection,
        violenceCriminalization,
        goodPlaceToLive,
        transgenderLegal,
        transMurderRates,
        illegalSameSexRelationships,
        propaganda,
        safetyIndex,
        score,
    } = req.body
    const country = {
        name,
        description,
        img,
        alpha3Code,
        discriminationProtection,
        violenceCriminalization,
        goodPlaceToLive,
        transgenderLegal,
        transMurderRates,
        illegalSameSexRelationships,
        propaganda,
        safetyIndex,
        score,
    }

    Country
        .findByIdAndUpdate(id, country, { runValidators: true, new: true })
        .then(country => res.json(country))
        .catch(err => next(err))

})

router.delete('/:id/delete', verifyToken, (req, res, next) => {

    const { id } = req.params

    Country
        .findByIdAndDelete(id)
        .then(country => res.json(country))
        .catch(err => next(err))

})

module.exports = router