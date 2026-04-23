export const successResponse = (statusCode = 200, message = "Success", data = null, meta = null) => {
    return {
        statusCode, success: true, message, data, ...(meta && {meta})
    };
};

export const throwError = (statusCode = 500, message = "Something went wrong") => {
    const err = new Error(message);
    err.success = false;
    err.statusCode = statusCode;
    throw err;
};