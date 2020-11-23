const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = process.env.AUTH_SECRET ? null : require('../../.env')
const dbErrors = require('../common/sendErrorsFromDb')
const user = require('./user')

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{6,20})/

const login = (req, res) => {
    const email = req.body.email || ''
    const password = req.body.password || ''
    User.findOne({ email }, (err, user) => {
        if (err) {
            return dbErrors.sendErrorsFromDB(res, err)
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

const findUserByNicknameAndSave = async (req, res) => {
    await User.findOne({ nickname: req.body.nickname }, async (err, user) => {
        if (err) {
            return dbErrors.sendErrorsFromDB(res, err)
        } else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        } else {
            const newUser = new User({ name: req.body.name, email: req.body.email, nickname: req.body.nickname, password: req.body.passwordHash })
            await newUser.save(async err => {
                if (err) {
                    return dbErrors.sendErrorsFromDB(res, err)
                } else {
                    return await login(req, res)
                }
            })
        }
    })
}

const findUserByEmail = async (req, res) => {
    await User.findOne({ email: req.body.email }, async (err, user) => {
        if (err) {
            return dbErrors.sendErrorsFromDB(res, err)
        } else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        } else {
            return await findUserByNicknameAndSave(req, res)
        }
    })
}

const findUserByNickname = async (req, res) => {
    await User.findOne({ nickname: req.body.nickname }, async (err, user) => {
        if (err) {
            return dbErrors.sendErrorsFromDB(res, err)
        }
        else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        }
        else {
            return await findUserByEmail(req, res)
        }
    })
}

const signup = async (req, res, next) => {
    if (!req.body.email.match(emailRegex)) {
        return res.status(400).send({ errors: ['O e-mail informado está inválido'] })
    }
    if (!req.body.password.match(passwordRegex)) {
        return res.status(400).send({ errors: [ 'Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@ # $ % !) e tamanho entre 6 - 20. ' ] })
    }

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(req.body.password, salt)
    if (!bcrypt.compareSync(req.body.confirm_password, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }
    else {
        req.body.passwordHash = passwordHash
        return await findUserByNickname(req, res)
    }
}

module.exports = { login, signup, validateToken }