const billRouter = require('./bills')
function route(app) {
    app.use('/v1/bill', billRouter)
}   

module.exports = route;