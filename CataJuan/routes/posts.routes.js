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

router.post('/:id/comments/create', (req, res, next) => {

    const { id } = req.params
    const { owner, comment } = req.body

    Comment
        .create({ owner, comment, commentOver: 'POST' })
        .then(({ _id: commentId }) => Post.findByIdAndUpdate(id, { $push: { comments: commentId } }, { new: true }))
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
