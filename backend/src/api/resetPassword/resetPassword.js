const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const _ = require('lodash')

const User = require('../user/user');

const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!]).{6,20})/
const env = process.env.RESET_PASSWORD_EMAIL ? null : require('../../.env')

const sendResetPasswordEmail = (req, res, next) => {
    const email = req.body.email; 
    if(email === '') {
        return res.status(400).send({ errors: ['O preenchimento do e-mail é obrigatório. Por favor, preencha essa informação']});
    }

    User.findOne({email}, (err, user) => {
        if(err) {
            return sendErrorsFromDB(res, err);
        } else if(user) {
            const token = crypto.randomBytes(20).toString('hex');
            User.findOneAndUpdate({email}, {resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000}, {new: true} , (err, user) => {
                if(err) {
                    return sendErrorsFromDB(res, err);
                }
                else if(user) {

                    const transporter = nodemailer.createTransport({
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

                    transporter.sendMail(mailOptions, (err, response) => {
                        if(err) {
                            return res.status(400).send({ errors: ['Ocorreu um erro durante o envio de seu e-mail. Tentar novamente mais tarde.', `Descrição técnica: ${error}`] })
                        } else {
                            res.status(200).send('e-mail enviado com sucesso');
                        }
                    })
                }
            })
        } else {
            return res.status(400).send({errors: ['Usuário não encontrado!']})
        }
    })
}

const changePassword = (req, res, next) => {
    const token = req.body.token;
    const password = req.body.password;
    const confirmationPassword = req.body.confirmationPassword;

    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    if (!password.match(passwordRegex)) {
        return res.status(400).send({ errors: [ 'Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@ # $ % !) e tamanho entre 6 - 20. ' ] })
    }

    if(!bcrypt.compareSync(confirmationPassword, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }

     
    User.findOneAndUpdate({ resetPasswordToken: token }, { password: passwordHash, resetPasswordToken: '', resetPasswordExpires: 0 }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        }
        else if (user) {
            return res.status(200).send({response: 'Senha alterada com sucesso!'})
        }
    })
}

const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []

    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({
        errors
    })
}

module.exports = { sendResetPasswordEmail, changePassword };