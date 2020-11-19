const mongoose = require('mongoose')
const conStr = process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://db:27017/footapp'
const UserMigrations = require('./userMigrations')

try {
    mongoose.connect(conStr, {
        useNewUrlParser: true
    })
    .then(async (con) => {
        console.log('User migrations')
        try {
            await UserMigrations.addProfilePictureField()
            await UserMigrations.addNicknameField()
            await UserMigrations.removeResetPasswordFields()
            
            return process.exit(0)
        }
        catch (e) {
            console.log(e)
        }
        console.log('\n')
    })
} catch (e) {
    console.log(e)
}


