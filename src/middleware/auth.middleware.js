import jwt from 'jsonwebtoken';
import {throwError} from "../utils/response-helper.js";

export function authenticatedUser(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throwError(400, "Invalid token");
    }

    const token = authHeader.split(" ")[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);

        next();
    } catch (err) {
        throwError(401, "Invalid token");
    }
}
