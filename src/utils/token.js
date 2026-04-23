import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import * as crypto from "node:crypto";
import {throwError} from "./response-helper.js";

export function generateJwtToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN});
}

export async function generateEmailToken(userId, TOKEN_TTL, tokenType) {
    const rawToken = crypto.randomUUID().replace(/-/g, "");

    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    const key = `${tokenType}:${hashedToken}`;

    await redis.set(key, JSON.stringify({userId}), "EX", TOKEN_TTL);

    return rawToken;
}

export async function validateEmailToken(userId, token, tokenType) {
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const key = `${tokenType}:${hashedToken}`;

    const data = await redis.get(key);
    if (!data) throwError(400, "Invalid token");

    const dp = JSON.parse(data);

    if (!dp || dp.userId.toString() !== userId.toString())
        throwError(400, "Invalid token");

    return key;
}
