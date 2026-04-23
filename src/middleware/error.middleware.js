import { ZodError } from "zod";

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Data Validation error",
            errors: err.issues
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    return res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && {stack: err.stack}),
    });
};

export default errorMiddleware;