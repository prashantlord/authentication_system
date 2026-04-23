import {generateEmailToken, validateEmailToken} from "../utils/token.js";
import {successResponse, throwError} from "../utils/response-helper.js";
import User from "../models/user.model.js";
import redis from "../config/redis.js";
import {sendEmailJob} from "../jobs/queues/email.queue.js";

const TOKEN_TTL = 5 * 600; // 5 min

export async function promptResetPasswordService(authUser) {
    const token = await generateEmailToken(authUser.id, TOKEN_TTL, "reset-password");

    const link = `${process.env.FRONTEND_URL}/reset-password/${authUser.id}/${token}`;

    sendEmailJob(authUser.email, "Password Reset", "reset-password", {
        link, name: authUser.username,
    });

    return successResponse(200, "Verification email sent successfully.", {});
}

export async function resetPasswordService(authUserId, token, oldPassword, newPassword) {
    const key = await validateEmailToken(authUserId, token, "reset-password");

    if (!key) throwError(400, "Invalid token");

    const user = await User.findById(authUserId).select("+password");

    if (!await user.comparePassword(oldPassword)) {
        throwError(400, "Invalid password");
    }

    user.password = newPassword;
    await user.save();

    await redis.del(key);

    return successResponse(200, "Password reset successfully.", {});
}
