const postModel = require('../models/Post');
const ResponseUtils = require('../libraries/Utils/ResponseUtils');

class PostsController {
    //Get all Posts
    async index (req, res) {
        try {
            let result = await postModel.getAll();

            return ResponseUtils.send(req, res, { data: result });
        } catch (err) {
            return ResponseUtils.send(req, res, {
                code: CONSTANT.HTTP_STATUS_BAD_REQUEST,
                message: "Thông tin tìm kiếm không hợp lệ.",
            });
        }
    }
}

module.exports = new PostsController;