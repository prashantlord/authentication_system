import {generateEmailToken, validateEmailToken} from "../utils/token.js";
import sendEmail from "../utils/send-email.js";
import {successResponse, throwError} from "../utils/response-helper.js";
import redis from "../config/redis.js";

const TOKEN_TTL = 5 * 60; // 10 min

export async function promptForgotPasswordService(user) {
    const token = await generateEmailToken(user._id, TOKEN_TTL, "forgot-password");
    const link = `${process.env.FRONTEND_URL}/forgot-password/${user._id}/${token}`;

    await sendEmail(user.email, "Password Reset", "reset-password", {
        link, name: user.username,
    });

    return successResponse(200, "Forgot password email sent successfully.", {});
}

export async function forgotPasswordService(user, token, newPassword) {
    const key = await validateEmailToken(user._id, token, "forgot-password");

    if (!key) throwError(400, "Invalid token");

    user.password = newPassword;
    await user.save();

    await redis.del(key);

    return successResponse(200, "Password reset successfully.", {});
}