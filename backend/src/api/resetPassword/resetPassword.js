const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const _ = require('lodash')
const moment = require('moment')

const User = require('../user/user');
const ResetPasswordRequisition = require('./resetPasswordRequisition');
const dbErrors = require('../common/sendErrorsFromDb')

const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{6,20})/
const env = process.env.RESET_PASSWORD_DOMAIN_URL ? null : require('../../.env')

const sendEmail = async (res, email, token) => {
    const transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'footappservices@gmail.com',
            pass: 'Footapp@123',
        },
    });

    const mailOptions = {
        from: 'Footapp Services',
        to: email,
        subject: 'Link to reset password',
        text: 'Olá!\n \n'
        + 'Você solicitou o reset de senha da sua conta Footapp? Caso sim, clique no link ou cole no eu navegador o link abaixo para prosseguir ou cole em seu navegador.\n \n' 
        + `${(process.env.RESET_PASSWORD_DOMAIN_URL ? process.env.RESET_PASSWORD_DOMAIN_URL : env.RESET_PASSWORD_DOMAIN_URL)}/reset-password/${token}/changePassword`
    };

    await transporter.sendMail(mailOptions, (err, response) => {
        if(err) {
            return res.status(400).send({ errors: ['Ocorreu um erro durante o envio de seu e-mail. Tentar novamente mais tarde.', `Descrição técnica: ${err}`] })
        } else {
            res.status(200).send('e-mail enviado com sucesso');
        }
    })
}

const createResetPasswordRequisition = async (email, startDateTs, endDateTs, res) => {
    const token = crypto.randomBytes(20).toString('hex');
    const newResetPasswordRequisition = new ResetPasswordRequisition({
        token: token,
        email: email,
        startDateTs: startDateTs, 
        endDateTs: endDateTs
    });

    await newResetPasswordRequisition.save(async err => {
        if(err) {
            return dbErrors.sendErrorsFromDB(res, err);
        }
        else {
            return await sendEmail(res, email, token)
        }
    });
}

const findUser = (email, res, startDateTs, endDateTs) => {
    User.findOne({ email }, async (err, user) => {
        if (err) {
            return dbErrors.sendErrorsFromDB(res, err);
        } else if (user) {
            return await createResetPasswordRequisition(email, startDateTs, endDateTs, res)
        } else {
            return res.status(400).send({errors: ['Usuário não encontrado!']})
        }
    })
}

const sendResetPasswordEmail = async (req, res, next) => {
    const email = req.body.email;
    const startDateTs = moment().unix();
    const endDateTs = moment(new Date()).add(1, 'days').unix();

    if(!email) {
        return res.status(400).send({ errors: ['O preenchimento do e-mail é obrigatório. Por favor, preencha essa informação']});
    }

    if(!email.match(emailRegex)) {
        return res.status(400).send({ errors: ['O e-mail informado está inválido'] });
    }

    return await findUser(email, res, startDateTs, endDateTs)
}

const findUserAndUpdate = async (res, resetPasswordRequisition, todayTs, passwordHash) => {
    const startDateTs = resetPasswordRequisition.startDateTs
    const endDateTs = resetPasswordRequisition.endDateTs
    const email = resetPasswordRequisition.email;
    const id = resetPasswordRequisition._id;

    if (todayTs >= startDateTs && todayTs <= endDateTs) {
        await User.findOneAndUpdate({ email }, { password: passwordHash }, async (err, user) => {
            if (err) {
                return dbErrors.sendErrorsFromDB(res, err)
            }
            else if (user) {
                await ResetPasswordRequisition.deleteOne({ _id: id }, () => {
                    return res.status(200).send({response: 'Senha alterada com sucesso!'})
                })
            }
        })
    }
    else {
        return res.status(400).send({ errors: ['Solicitação expirada.'] })
    }
}

const findResetPasswordRequisition = async (res, token, passwordHash, todayTs) => {
    await ResetPasswordRequisition.findOne({ token }, async (err, resetPasswordRequisition) => {
        if( err ) {
            return dbErrors.sendErrorsFromDB(res, err);
        } 
        else if (resetPasswordRequisition) {
            return await findUserAndUpdate(res, resetPasswordRequisition, todayTs, passwordHash)
        } 
        else {
            return res.status(400).send({errors: ['Token inválido!']})
        }
    });
}

const changePassword = async (req, res, next) => {
    const token = req.body.token || '';
    const password = req.body.password || '';
    const confirmationPassword = req.body.confirmationPassword || '';
    const todayTs = moment().unix();

    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    if (!password.match(passwordRegex)) {
        return res.status(400).send({ errors: [ 'Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@ # $ % !) e tamanho entre 6 - 20. ' ] })
    }

    if(!bcrypt.compareSync(confirmationPassword, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }

    return await findResetPasswordRequisition(res, token, passwordHash, todayTs)
}

module.exports = { sendResetPasswordEmail, changePassword };