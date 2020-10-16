const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = process.env.AUTH_SECRET ? null : require('../../.env')
const { sendErrorsFromDB } = require('../common/sendErrorsFromDb')
const user = require('./user')

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{6,20})/

const login = (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''
    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(user, process.env.AUTH_SECRET ? process.env.AUTH_SECRET : env.authSecret, {
                expiresIn: "1 day"
            })
            const { name, email, nickname } = user
            return res.status(200).send({ name, email, token, nickname })
        } else {
            return res.status(400).send({
                errors: ['Usuário/Senha inválidos']
            })
        }
    })
}

const validateToken = (req, res, next) => {
    const token = req.body.token || ''

    jwt.verify(token, process.env.AUTH_SECRET ? process.env.AUTH_SECRET : env.authSecret, function (err, decoded) {
        return res.status(200).send({
            valid: !err
        })
    })
}

const signup = async (req, res, next) => {
    const name = req.body.name || ''
    const email = req.body.email || ''
    const nickname = req.body.nickname || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''

    if (!email.match(emailRegex)) {
        return res.status(400).send({ errors: ['O e-mail informado está inválido'] })
    }
    if (!password.match(passwordRegex)) {
        return res.status(400).send({ errors: [ 'Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@ # $ % !) e tamanho entre 6 - 20. ' ] })
    }

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }

    User.findOne({ nickname }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        }
        else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        }
        else {
            User.findOne({ email }, (err, user) => {
                if (err) {
                    return sendErrorsFromDB(res, err)
                } else if (user) {
                    return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
                } else {
                    User.findOne({ nickname }, (err, user) => {
                        if (err) {
                            return sendErrorsFromDB(res, err)
                        } else if (user) {
                            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
                        } else {
                            const newUser = new User({ name, email, nickname, password: passwordHash })
                            newUser.save(err => {
                                if (err) {
                                    return sendErrorsFromDB(res, err)
                                } else {
                                    login(req, res, next)
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

module.exports = { login, signup, validateToken }