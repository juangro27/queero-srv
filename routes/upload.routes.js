const router = require("express").Router()

const uploader = require('../middlewares/uploader.middleware')

router.post('/image', uploader.single('imageUrl'), (req, res, next) => {

    if (!req.file) {
        return res.json('no image')
    } else {
        res.json({ cloudinary_url: req.file.path })
    }

})

module.exports = router