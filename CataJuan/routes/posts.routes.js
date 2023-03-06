const Country = require("../models/Country.model")
const Post = require("../models/Post.model")

const router = require("express").Router()

router.get('/', (req, res, next) => {

    Post
        .find()
        .then(posts => res.json(posts))
        .catch(err => next(err))

})

router.get('/:id', (req, res, next) => {

    const { id } = req.params

    Post
        .findById(id)
        .then(post => res.json(post))
        .catch(err => next(err))

})

router.post('/create', (req, res, next) => {

    const {
        title,
        postImg,
        owner,
        country,
        description
    } = req.body

    const post = { title, postImg, owner, country, description }

    Post
        .create(post)
        .then(({ _id: postId }) => {
            const promises = [
                Country.findByIdAndUpdate(country, { $push: { posts: postId } }),
                Post.findById(postId)
            ]
            return Promise.all(promises)
        })
        .then(([, post]) => res.json(post))
        .catch(err => next(err))

})

router.put('/:id/edit', (req, res, next) => {

    const { id } = req.params

    const {
        title,
        postImg,
        description
    } = req.body

    const post = { title, postImg, description }

    Post
        .findByIdAndUpdate(id, post, { new: true })
        .then(post => res.json(post))
        .catch(err => next(err))

})

router.delete('/:id/delete', (req, res, next) => {

    const { id } = req.params
    const { countryId } = req.body

    const promises = [
        Country
            .findByIdAndUpdate(countryId, { $pull: { posts: id } })
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
            }),

        Post.findByIdAndDelete(id)
    ]

    Promise.all(promises)
        .then(([country]) => res.json(country))
        .catch(err => next(err))

})



module.exports = router
