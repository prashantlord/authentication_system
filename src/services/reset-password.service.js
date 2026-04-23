import {generateEmailToken, validateEmailToken} from "../utils/token.js";
import sendEmail from "../utils/send-email.js";
import {successResponse, throwError} from "../utils/response-helper.js";
import User from "../models/user.model.js";
import redis from "../config/redis.js";

const TOKEN_TTL = 5 * 60; // 10 min

export async function promptResetPasswordService(userDetails) {
    const token = await generateEmailToken(userDetails.id, TOKEN_TTL, "reset-password");

    const link = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail(userDetails.email, "Password Reset", "reset-password", {
        link, name: userDetails.username,
    });

    return successResponse(200, "Verification email sent successfully.", {});
}

export async function resetPasswordService(userDetails, token, oldPassword, newPassword) {
    const key = await validateEmailToken(userDetails.id, token, "reset-password");

    if (!key) throwError(400, "Invalid token");

    const user = await User.findById(userDetails.id).select("+password");

    if (!await user.comparePassword(oldPassword)) {
        throwError(400, "Invalid password");
    }

    user.password = newPassword;
    await user.save();

    await redis.del(key);

    return successResponse(200, "Password reset successfully.", {});
}
