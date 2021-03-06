const mongoose = require('mongoose')
const conStr = 'mongodb://db:27017/footapp_test'
const User = require('../src/api/user/user')
const Match = require('../src/api/match/match')
const RequestFriendship = require('../src/api/friendshipRequest/friendshipRequest')

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
    Match.deleteMany({}, (err) => {
      mongoose.disconnect()
    })
    RequestFriendship.deleteMany({}, (err) => {
      mongoose.disconnect()
    })
})

