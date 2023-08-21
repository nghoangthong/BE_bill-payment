const billRouter = require('./bills')
const serviceRouter = require('./services')
function route(app) {
    app.use('/v1/bill', billRouter)
    app.use('/v1', serviceRouter)
}   

module.exports = route;