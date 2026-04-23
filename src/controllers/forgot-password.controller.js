import User from "../models/user.model.js";
import {throwError} from "../utils/response-helper.js";
import {forgotPasswordService, promptForgotPasswordService} from "../services/forgot-password.service.js";

export async function promptForgotPassword(req, res) {
    const {email} = req.body;

    const user = await User.findOne({
        email
    });

    if (!user) throwError(404, "User not found");

    const data = await promptForgotPasswordService(user);

    return res.status(data.statusCode).json(data);
}

export async function forgotPassword(req, res) {
    const token = req.params.token;
    const userId = req.params.userId;
    const {newPassword} = req.body;

    if (!token) {
        throwError(404, "Token not found");
    }

    const user = await User.findById(userId).select("+password");

    const data = await forgotPasswordService(user, token, newPassword);

    return res.status(data.statusCode).json(data);
}