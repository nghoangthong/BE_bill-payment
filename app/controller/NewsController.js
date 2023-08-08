const ResponseUtils = require('../libraries/Utils/ResponseUtils');

class NewsController {
    //News Index
    index (req, res) {
        return ResponseUtils.send(req, res, { data: 'Hello World!' });
    }

    // GET /news/create
    create (req, res, next) {
        return ResponseUtils.send(req, res, { data: 'Created news!' });
    }

    show(req, res) {
        return ResponseUtils.send(req, res, { data: 'News details!' });
    }
}

module.exports = new NewsController;