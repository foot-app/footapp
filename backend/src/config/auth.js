const jwt = require('jsonwebtoken')
const env = process.env.AUTH_SECRET ? null : require('../.env')

const verifyJwt = async (res, next, token) => {
    await jwt.verify(token, process.env.AUTH_SECRET ? process.env.AUTH_SECRET : env.authSecret, function (err, decoded) {
        if (err) {
            return res.status(403).send({ errors: ['Failed to authenticate token.'] })
        } else {
            next()
        }
    })
}

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    } else {
        const token = req.body.token || req.query.token || req.headers['authorization']

        if (!token) {
            return res.status(403).send({
                errors: ['No token provided.']
            })
        }

        return verifyJwt(res, next, token) 
    }
}