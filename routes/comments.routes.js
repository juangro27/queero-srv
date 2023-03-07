const router = require("express").Router()
const Comment = require("../models/Comment.model")
const Country = require('../models/Country.model')
const Post = require('../models/Post.model')


router.post('/create/:type/:id', (req, res, next) => {

    const { id, type } = req.params
    const { owner, comment } = req.body

    Comment
        .create({ owner, comment, commentOver: type })
        .then(({ _id: commentId }) => {
            return type === 'country' ?
                Country.findByIdAndUpdate(id, { $push: { comments: commentId } }, { new: true })
                : Post.findByIdAndUpdate(id, { $push: { comments: commentId } }, { new: true })
        })
        .then(response => res.json(response))
        .catch(err => next(err))

})


router.put('/:id/edit/:type', (req, res, next) => {

    const { id, type } = req.params
    const { commentId, comment } = req.body

    Comment
        .findByIdAndUpdate(commentId, { comment })
        .then(() => {

            if (type === 'country') {
                return Country
                    .findById(id)
                    .populate({
                        path: "comments",
                        select: '-updatedAt',
                        populate: {
                            path: 'owner',
                            select: '-__v -password -email -role -createdAt -updatedAt'
                        }
                    })
            }
            else {
                return Post
                    .findById(id)
                    .populate({
                        path: "comments",
                        select: '-updatedAt',
                        populate: {
                            path: 'owner',
                            select: '-__v -password -email -role -createdAt -updatedAt'
                        }
                    })

            }
        })
        .then(response => res.json(response))
        .catch(err => next(err))

})


router.delete('/:id/delete/:type', (req, res, next) => {

    const { id, type } = req.params
    const { commentId } = req.body


    Comment
        .findByIdAndDelete(commentId)
        .then(() => {
            if (type === 'country') {
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
            }
            else {
                return Post
                    .findByIdAndUpdate(id, { $pull: { comments: commentId } })
                    .populate({
                        path: "comments",
                        select: '-updatedAt',
                        populate: {
                            path: 'owner',
                            select: '-__v -password -email -role -createdAt -updatedAt'
                        }
                    })
            }

        })
        .then(response => res.json(response))
        .catch(err => next(err))

})

module.exports = router