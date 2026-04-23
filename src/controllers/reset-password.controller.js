import {promptResetPasswordService, resetPasswordService} from "../services/reset-password.service.js";
import {throwError} from "../utils/response-helper.js";

export async function promptResetPassword(req, res) {
    const userDetails = req.user;

    const data = await promptResetPasswordService(userDetails);

    return res.status(data.statusCode).json(data);
}

export async function resetPassword(req, res) {
    const userDetails = req.user;
    const token = req.params.token;
    const {oldPassword, newPassword} = req.body;

    if (!token) {
        throwError(404, "Token not found");
    }

    const data = await resetPasswordService(userDetails, token, oldPassword, newPassword);

    return res.status(data.statusCode).json(data);
}