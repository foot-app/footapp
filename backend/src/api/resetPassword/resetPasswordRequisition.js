const restful = require('node-restful')
const mongoose = restful.mongoose

const resetPasswordRequisitionSchema = new mongoose.Schema({
    token: { type: String, required: true },
    email: { type: String, required: true },
    startDateTs: { type: Number, required: true },
    endDateTs: { type: Number, required: true }
})

module.exports = restful.model('ResetPasswordRequisition', resetPasswordRequisitionSchema)