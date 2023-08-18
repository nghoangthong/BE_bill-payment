const Joi = require("joi");

const validateBillsCheckSchema = Joi.object({
    billCode: Joi.string().trim().required().messages({
        'string.base': 'Mã hoá đơn/Mã thanh toán phải là chuỗi',
        'string.empty': 'Mã hoá đơn/Mã thanh toán không được bỏ trống',
        'any.required': 'Mã hoá đơn/Mã thanh toán không được bỏ trống',
    }),
    partnerRefId: Joi.string().trim().optional().messages({
        'string.base': 'Mã giao dịch phải là chuỗi',
    }),
    serviceCode: Joi.string().trim().required().messages({
        'string.base': 'Mã dịch vụ phải là chuỗi',
        'any.required': 'Mã dịch vụ không được bỏ trống',
        'string.empty': 'Mã dịch vụ không được bỏ trống'
    }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

const validateHeaderSchema = Joi.object({
    'x-service-id': Joi.string().trim().required().messages({
        'string.base': 'service-id phải là chuỗi',
        'string.empty': 'service-id không được bỏ trống',
        'any.required': 'service-id không được bỏ trống',
    }),
    'x-tenant-id': Joi.string().trim().optional().default('agama').messages({
        'string.base': 'tenant-id phải là chuỗi',
        'string.empty': 'tenant-id không được bỏ trống',
    }),
}).options({
    allowUnknown: true,
    stripUnknown: false,
});

module.exports = {
    validateBillsCheckSchema,
    validateHeaderSchema
};
