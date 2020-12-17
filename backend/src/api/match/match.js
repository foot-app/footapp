const restful = require('node-restful')
const mongoose = restful.mongoose

const matchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rentAmount: { type: Number},
    matchType: { type: String, enum: ['fut7', 'futsal'], required: true},
    creatorHasBall: {type: Boolean, required: true},
    creatorHasVest: { type: Boolean, required: true},
    goalkeeperPays: { type: Boolean, required: true},
    isAPrivateMatch: { type: Boolean, required: true},
    street: { type: String, required: true},
    number: { type: Number, required: true},
    neighborhood: {type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
    date: { type: Date, required: true},
    ownerNickname: { type: String, required: true},
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = restful.model('Match', matchSchema)