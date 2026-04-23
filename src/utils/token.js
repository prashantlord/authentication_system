import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import * as crypto from "node:crypto";
import {throwError} from "./response-helper.js";

export function generateJwtToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN});
}

export async function generateEmailToken(userId, TOKEN_TTL = 60, tokenType) {
    const rawToken = crypto.randomUUID().replace(/-/g, "");

    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const key = `${tokenType}:${userId}`;

    await redis.set(key, hashedToken, "EX", TOKEN_TTL);

    return rawToken;
}

export async function validateEmailToken(userId, token, tokenType) {
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const key = `${tokenType}:${userId}`;

    const res = await redis.get(key);
    if (!res) throwError(400, "Invalid token");

    if (String(res) !== String(hashedToken)) {
        throwError(400, "Invalid token");
    }

    return key;
}
