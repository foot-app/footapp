const { Schema } = require('mongoose')
const restful = require('node-restful')
const mongoose = restful.mongoose

const matchParticipant = new mongoose.Schema({
    match_id: Schema.Types.ObjectId,
    user_id:
})

module.exports = restful.model('Match', matchSchema)