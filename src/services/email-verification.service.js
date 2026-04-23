import {generateEmailToken, validateEmailToken} from "../utils/token.js";
import {successResponse, throwError} from "../utils/response-helper.js";
import sendEmail from "../utils/send-email.js";
import redis from "../config/redis.js";
import User from "../models/user.model.js";

const TOKEN_TTL = 10 * 600; // 10 min

export async function promptEmailVerificationService(authUser) {
    const token = await generateEmailToken(authUser.id, TOKEN_TTL, "verify-email");
    const link = `${process.env.FRONTEND_URL}/verify-email/${authUser.id}/${token}`;

    await sendEmail(authUser.email, "Email Verification", "verify-email", {
        link, name: authUser.username,
    });

    return successResponse(200, "Verification email sent successfully.", {});
}

export async function emailVerificationService(token, authUserId) {
    const key = await validateEmailToken(authUserId, token, "verify-email");

    if (!key) throwError(400, "Invalid token");

    await User.findByIdAndUpdate(authUserId, {
        emailVerifiedAt: Date.now()
    });

    await redis.del(key);

    return successResponse(200, "Email verified", {});
}