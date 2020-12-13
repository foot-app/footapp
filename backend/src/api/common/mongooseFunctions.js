const dbErrors = require('./sendErrorsFromDb')

const findOneAndUpdate = async (Model, queryObj, changeObj, res) => {
    await Model.findOneAndUpdate(queryObj, changeObj, (error, model) => {
        if (error) {
            return dbErrors.sendErrorsFromDB(res, error)
        }
        else {
            return res.status(200).json({ message: 'Informações alteradas com sucesso' })
        }
    })
}

module.exports = { findOneAndUpdate }