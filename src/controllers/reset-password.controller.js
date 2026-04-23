import {promptResetPasswordService, resetPasswordService} from "../services/reset-password.service.js";
import {throwError} from "../utils/response-helper.js";

export async function promptResetPassword(req, res) {
    const authUser = req.user;

    const data = await promptResetPasswordService(authUser);

    return res.status(data.statusCode).json(data);
}

export async function resetPassword(req, res) {
    const {id: authUserId} = req.user;
    const {userId, token} = req.params;
    const {oldPassword, newPassword} = req.body;

    if (!token) {
        throwError(400, "Token is required");
    }

    if (!authUserId) {
        throwError(401, "Authentication required");
    }

    if (String(userId) !== String(authUserId)) {
        throwError(403, "Forbidden: user mismatch");
    }

    const data = await resetPasswordService(authUserId, token, oldPassword, newPassword);

    return res.status(data.statusCode).json(data);
}