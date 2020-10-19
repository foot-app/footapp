const restful = require('node-restful')
const mongoose = restful.mongoose

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    nickname: { type: String, required: true },
    password: { type: String, min: 6, max: 12, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number },
    height: { type: Number, min: 1 },
    weight: { type: Number, min: 1 },
    preferredFoot: { type: String, enum: ['Direito', 'Esquerdo', 'Ambos'] }
})

module.exports = restful.model('User', userSchema)