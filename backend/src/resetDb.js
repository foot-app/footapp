const mongoose = require('mongoose')
const conStr = 'mongodb://db:27017/footapp_test'
const User = require('../src/api/user/user')

mongoose.connect(conStr, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    User.deleteMany({}, (err) => {
        mongoose.disconnect()
    })
})

