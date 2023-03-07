const router = require("express").Router()
const Comment = require("../models/Comment.model")
const Country = require('../models/Country.model')


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
            }
        })
        .then(country => res.json(country))
        .catch(err => next(err))

})

router.put('/:id/edit', (req, res, next) => {

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
        .findByIdAndUpdate(id, country, { new: true })
        .then(country => res.json(country))
        .catch(err => next(err))

})

router.delete('/:id/delete', (req, res, next) => {

    const { id } = req.params

    Country
        .findByIdAndDelete(id)
        .then(country => res.json(country))
        .catch(err => next(err))

})

router.post('/:id/comments/create', (req, res, next) => {

    const { id } = req.params
    const { owner, comment } = req.body

    Comment
        .create({ owner, comment, commentOver: 'COUNTRY' })
        .then(({ _id: commentId }) => Country.findByIdAndUpdate(id, { $push: { comments: commentId } }, { new: true }))
        .then(country => res.json(country))
        .catch(err => next(err))

})

router.put('/:id/comments/edit', (req, res, next) => {

    const { id } = req.params
    const { commentId, comment } = req.body

    Comment
        .findByIdAndUpdate(commentId, { comment })
        .then(() => Country
            .findById(id)
            .populate({
                path: "comments",
                select: '-updatedAt',
                populate: {
                    path: 'owner',
                    select: '-__v -password -email -role -createdAt -updatedAt'
                }
            }))
        .then(country => res.json(country))
        .catch(err => next(err))

})

router.delete('/:id/comments/delete', (req, res, next) => {

    const { id } = req.params
    const { commentId } = req.body


    Comment
        .findByIdAndDelete(commentId)
        .then(() => {
            return Country
                .findByIdAndUpdate(id, { $pull: { comments: commentId } })
                .populate({
                    path: "comments",
                    select: '-updatedAt',
                    populate: {
                        path: 'owner',
                        select: '-__v -password -email -role -createdAt -updatedAt'
                    }
                })
                .populate({
                    path: 'posts',
                    select: 'title'
                })
        })
        .then(country => res.json(country))
        .catch(err => next(err))

})

module.exports = router