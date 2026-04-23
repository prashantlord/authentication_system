import {promptEmailVerificationService, emailVerificationService} from "../services/email-verification.service.js";
import User from "../models/user.model.js";
import {successResponse, throwError} from "../utils/response-helper.js";

export async function promptEmailVerification(req, res) {
    const userDetails = req.user;

    const user = await User.findById(userDetails.id);

    if (await user.isEmailVerified()) {
        const data = successResponse(200, "Email already verified", {});
        return res.status(200).json(data);
    }

    const data = await promptEmailVerificationService(userDetails);

    return res.status(data.statusCode).json(data);
}

export async function emailVerification(req, res) {
    const userDetails = req.user;
    const token = req.params.token;

    if (!token) {
        throwError(404, "Token not found");
    }

    const data = await emailVerificationService(token, userDetails);

    return res.status(data.statusCode).json(data);
}