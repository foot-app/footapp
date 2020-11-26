const restful = require('node-restful')
const mongoose = restful.mongoose

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    nickname: { type: String, required: true },
    password: { type: String, min: 6, max: 12, required: true },
    height: { type: Number, min: 1 },
    weight: { type: Number, min: 1 },
    preferredFoot: { type: String, enum: ['Direito', 'Esquerdo', 'Ambos'] },
    profilePicture: { type: String },
    fut7Positions: [String],
    futsalPositions: [String]
})

module.exports = restful.model('User', userSchema)