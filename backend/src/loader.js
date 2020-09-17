const server = require('./config/server')

if (!(process.env.NODE_ENV && process.env.NODE_ENV == 'test')) {
    require('./config/database')
}

require('./config/routes')(server)

module.exports = server