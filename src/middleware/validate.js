export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body); // validated + sanitized
        next();
    } catch (err) {
        next(err);
    }
}