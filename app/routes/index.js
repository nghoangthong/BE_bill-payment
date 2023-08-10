const newsRouter = require('./news');
const postsRouter = require('./posts');
const billRouter = require('./bill')
function route(app) {
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.use('/v1/news', newsRouter);
    app.use('/v1/posts', postsRouter);
    app.use('/v1/service/bill', billRouter)
}   

module.exports = route;