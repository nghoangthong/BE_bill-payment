const Joi = require("joi");

const validateServiceParams = Joi.object({
    'service_id': Joi.string().trim().required().messages({
        'string.base': 'Mã dịch vụ phải là chuỗi',
        'string.empty': 'Mã dịch vụ không được bỏ trống',
        'any.required': 'Mã dịch vụ không được bỏ trống',
    })
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

module.exports = {
    validateServiceParams
}