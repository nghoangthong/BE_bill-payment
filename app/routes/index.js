const newsRouter = require('./news');
const postsRouter = require('./posts');

function route(app) {
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.use('/v1/news', newsRouter);
    app.use('/v1/posts', postsRouter);
}

module.exports = route;