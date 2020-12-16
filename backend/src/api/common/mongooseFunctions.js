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

const save = async (model, successMessage, res) => {
    await model.save(async err => {
        if (err) {
            return dbErrors.sendErrorsFromDB(res, err)
        } else {
            return res.status(200).json({ message: successMessage })
        }
    })
}

module.exports = { findOneAndUpdate, save }