const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose')
const server = require('../loader')
let app
var mongoServer

const connectMongoInMemory = async () => {
    mongoServer = new MongoMemoryServer();
    const URI = await mongoServer.getUri();

    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
}

const disconnectMongoose = async (done) => {
    await mongoose.disconnect(done)
    await mongoServer.stop()
}

const startServer = async () => {
    app = await server.listen(3001)
}

const closeServer = async done => {
    app.close(done)
}

const resetDB = async models => {
    models.forEach(async model => {
        await model.deleteMany({})
    })
}

module.exports = { connectMongoInMemory, disconnectMongoose, startServer, resetDB, closeServer }