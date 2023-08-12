const billRouter = require('./bills')
function route(app) {
    app.use('/v1/bill/payment', billRouter)
}   

module.exports = route;