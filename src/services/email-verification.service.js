import {generateEmailToken, validateEmailToken} from "../utils/token.js";
import {successResponse, throwError} from "../utils/response-helper.js";
import sendEmail from "../utils/send-email.js";
import redis from "../config/redis.js";
import User from "../models/user.model.js";

const TOKEN_TTL = 10 * 60; // 10 min

export async function promptEmailVerificationService(userDetails) {
    const token = await generateEmailToken(userDetails.id, TOKEN_TTL, "verify-email");
    const link = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await sendEmail(userDetails.email, "Email Verification", "verify-email", {
        link, name: userDetails.username,
    });

    return successResponse(200, "Verification email sent successfully.", {});
}

export async function emailVerificationService(token, userDetails) {
    const key = await validateEmailToken(userDetails.id, token, "verify-email");

    if (!key) throwError(400, "Invalid token");

    await User.findByIdAndUpdate(userDetails.id, {
        emailVerifiedAt: Date.now()
    });

    await redis.del(key);

    return successResponse(200, "Email verified", {});
}