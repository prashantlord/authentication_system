import {emailVerificationService, promptEmailVerificationService} from "../services/email-verification.service.js";
import User from "../models/user.model.js";
import {successResponse, throwError} from "../utils/response-helper.js";

export async function promptEmailVerification(req, res) {
    const authUser = req.user;

    const user = await User.findById(authUser.id);

    if (user.isEmailVerified()) {
        const data = successResponse(200, "Email already verified", {});
        return res.status(data.statusCode).json(data);
    }

    const data = await promptEmailVerificationService(authUser);

    return res.status(data.statusCode).json(data);
}

export async function emailVerification(req, res) {
    const {token, userId} = req.params;
    const {id: authUserId} = req.user || {};

    if (!token) {
        throwError(400, "Token is required");
    }

    if (!authUserId) {
        throwError(401, "Authentication required");
    }

    if (String(userId) !== String(authUserId)) {
        throwError(403, "Forbidden: user mismatch");
    }

    const data = await emailVerificationService(token, authUserId);

    return res.status(data.statusCode).json(data);
}