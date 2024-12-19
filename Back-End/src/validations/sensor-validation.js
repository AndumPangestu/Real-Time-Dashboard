import Joi from "joi";

export const createSensorDataValidator = Joi.object({
    suhu: Joi.number().required(),
    temperature: Joi.number().required(),
    status_a: Joi.number().valid(0, 1).required(),
    status_b: Joi.number().valid(0, 1).required(),
    timestamp: Joi.number().required()
});
