class ResponseUtils {
    static send (req, res, result) {
        let _code = result.code || CONSTANT.HTTP_STATUS_OK;
        let _msg = result.message || CONSTANT.OK;

        // set global http status code and response data
        return res.status(_code).json({
            code: _code,
            message: _msg,
            data: result.data || null,
            metadata: {
                created: new Date().toISOString()
            },
        });
    }
}

module.exports = ResponseUtils;
