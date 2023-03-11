const router = require("express").Router()
const Comment = require("../models/Comment.model")
const Country = require('../models/Country.model')
const { verifyToken } = require("../middlewares/verifyToken")



router.get('/', (req, res, next) => {

    const {
        discriminationProtection,
        violenceCriminalization,
        goodPlaceToLive,
        transgenderLegal,
        illegalSameSexRelationships,
        propaganda,
        calification,
        transMurderRates,
        safetyIndex,
        alphabetic: name,
        page
    } = req.query

    let sort = {}
    let queries = {}

    if (discriminationProtection) { queries.discriminationProtection = discriminationProtection }
    if (violenceCriminalization) { queries.violenceCriminalization = violenceCriminalization }
    if (goodPlaceToLive) queries.goodPlaceToLive = goodPlaceToLive
    if (transgenderLegal) queries.transgenderLegal = transgenderLegal
    if (illegalSameSexRelationships) queries.illegalSameSexRelationships = illegalSameSexRelationships
    if (propaganda) queries.propaganda = propaganda
    if (calification) queries.calification = calification
    if (transMurderRates) sort.transMurderRates = Number(transMurderRates)
    if (safetyIndex) sort.safetyIndex = Number(safetyIndex)
    if (name) sort.name = Number(name)

    console.log('PAGINA', page)

    Country
        .find(queries)
        .sort(sort)
        .skip(page * 20 - 20)
        .limit(20)
        .then(countries => res.json(countries))
        .catch(err => next(err))

})


router.get('/names', (req, res, next) => {

    const { page } = req.query

    Country
        .find()
        .select({ name: 1 })
        .skip(page * 20 - 20)
        .limit(20)
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

router.get('/code/:code', (req, res, next) => {

    const { code } = req.params

    Country
        .findOne({ alpha3Code: code })
        .select({
            name: 1,
            discriminationProtection: 1,
            violenceCriminalization: 1,
            goodPlaceToLive: 1,
            transgenderLegal: 1,
            transMurderRates: 1,
            illegalSameSexRelationships: 1,
            propaganda: 1,
            calification: 1,
            flag: 1,
            score: 1
        })
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
        calification,
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
        calification,
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