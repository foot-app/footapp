const mongoose = require('mongoose')
const conStr = process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://db:27017/footapp'
const UserMigrations = require('./userMigrations')

try {
    mongoose.connect(conStr, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(async (con) => {
        console.log('User migrations')
        await UserMigrations.addProfilePictureField()
        await UserMigrations.addNicknameField()
        await UserMigrations.removeResetPasswordFields()
        console.log('\n')
    })
} catch (e) {
    console.log(e)
}


