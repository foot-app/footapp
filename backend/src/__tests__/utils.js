const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose')
const server = require('../loader')
const request = require('supertest')
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

const getModel = async (Model, fakeObj, getSearchKeyAttribute, getSearchKeyValue, getExpectedAttribute, getExpectedValue) => {
    const instance = new Model(fakeObj)
    await instance.save()

    const searchKey = {}
    searchKey[getSearchKeyAttribute] = getSearchKeyValue
    const foundModel = await Model.findOne(searchKey)
    const expected = getExpectedValue
    const actual = foundModel[getExpectedAttribute]
    expect(actual).toEqual(expected)
}

const saveModel = async (Model, fakeObj, saveExpectedAttribute, saveExpectedValue) => {
    const model = new Model(fakeObj)
    const savedModel = await model.save()
    const expected = saveExpectedValue
    const actual = savedModel[saveExpectedAttribute]
    expect(actual).toEqual(expected)
}

const updateModel = async (Model, fakeObj, updateAttribute, updateAttributeNewValue) => {
    const model = new Model(fakeObj)
    await model.save()

    model[updateAttribute] = updateAttributeNewValue
    const updatedUser = await model.save()

    const expected = updateAttributeNewValue
    const actual = updatedUser[updateAttribute]
    expect(actual).toEqual(expected)
}

const signUp = async (statusCode, userObj, attributeToChangeKey, attributeToChangeValue) => {
    if (attributeToChangeKey != null && attributeToChangeValue != null && attributeToChangeKey != undefined && attributeToChangeValue != undefined) {
        userObj[attributeToChangeKey] = attributeToChangeValue
    }

    await request(server).post('/oapi/user/signup')
        .send(userObj)
        .expect(statusCode)
}

module.exports = {
    connectMongoInMemory,
    disconnectMongoose,
    startServer,
    resetDB,
    closeServer,
    getModel,
    saveModel,
    updateModel,
    signUp
}