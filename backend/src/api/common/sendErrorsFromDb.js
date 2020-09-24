const _ = require('lodash')

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []

    if (dbErrors.err > 1) {
        _.forIn(dbErrors.err, error => errors.push(error.message))
    }
    else {
        errors.push(dbErrors.message)
    }
    
    return res.status(400).json({
        errors
    })
}

module.exports = { sendErrorsFromDB }