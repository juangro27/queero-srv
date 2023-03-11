const getPageScore = model => {

    return model.findById(id)
        .select({ votes: 1 })
        .populate("votes", 'vote')
        .then(({ votes }) => {
            const votesCount = votes.reduce((acc, elm) => {
                const { vote } = elm
                if (vote === 'up') acc++
                return acc
            }, 0)
            const result = (votesCount ? ((votesCount / votes.length) * 100).toFixed(0) : 0)
            return res.json(result)
        })
        .catch(err => next(err))
}

module.exports = { getPageScore }