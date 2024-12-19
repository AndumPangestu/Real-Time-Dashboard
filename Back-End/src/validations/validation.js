import logger from "../application/logging.js";

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false
    })
    if (result.error) {
        logger.error("Validation error: ", result.error.details);
        throw Error;
    } else {
        return result.value;
    }
}

export default validate
