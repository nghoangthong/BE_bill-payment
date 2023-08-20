const Joi = require("joi");

const validateHeaderSchema = Joi.object({
    'x-service-id': Joi.string().trim().required().messages({
        'string.base': 'x-service-id phải là chuỗi',
        'string.empty': 'x-service-id không được bỏ trống',
        'any.required': 'x-service-id không được bỏ trống',
    }),
    'x-tenant-id': Joi.string().trim().optional().default(APP_SETTINGS.DEFAULT_TENANT_ID).messages({
        'string.base': 'x-tenant-id phải là chuỗi',
        'string.empty': 'x-tenant-id không được bỏ trống',
    }),
}).options({
    allowUnknown: true,
    stripUnknown: false,
});

const validateBillCheckSchema = Joi.object({
    billcode: Joi.string().trim().required().messages({
        'string.base': 'Mã hoá đơn/Mã thanh toán phải là chuỗi',
        'string.empty': 'Mã hoá đơn/Mã thanh toán không được bỏ trống',
        'any.required': 'Mã hoá đơn/Mã thanh toán không được bỏ trống',
    }),
    partner_ref_id: Joi.string().trim().optional().messages({
        'string.base': 'Mã giao dịch phải là chuỗi',
    }),
    service_code: Joi.string().trim().required().messages({
        'string.base': 'Mã dịch vụ phải là chuỗi',
        'any.required': 'Mã dịch vụ không được bỏ trống',
        'string.empty': 'Mã dịch vụ không được bỏ trống'
    }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

const validateBillPaymentSchema = Joi.object({
    billcode: Joi.string().trim().required().messages({
        'string.base': 'Mã hoá đơn/Mã thanh toán phải là chuỗi',
        'string.empty': 'Mã hoá đơn/Mã thanh toán không được bỏ trống',
        'any.required': 'Mã hoá đơn/Mã thanh toán không được bỏ trống',
    }),
    partner_ref_id: Joi.string().trim().optional().messages({
        'string.base': 'Mã giao dịch phải là chuỗi',
    }),
    service_code: Joi.string().trim().required().messages({
        'string.base': 'Mã dịch vụ phải là chuỗi',
        'any.required': 'Mã dịch vụ không được bỏ trống',
        'string.empty': 'Mã dịch vụ không được bỏ trống'
    }),
    amount: Joi.number().min(0).integer().required().messages({
        'number.base': 'Số tiền thanh toán phải là số nguyên.',
        'number.less': 'Số tiền thanh toán không nhỏ hơn 0.',
        'any.required': 'Số tiền thanh toán không được bỏ trống'
    }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

module.exports = {
    validateHeaderSchema,
    validateBillCheckSchema,
    validateBillPaymentSchema
};
