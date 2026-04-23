import rateLimit, {ipKeyGenerator} from "express-rate-limit";
import {RATE_LIMITS} from "../config/limiter.js";

// reusable factory
const createLimiter = ({windowMs, max}, options = {}) => {
    return rateLimit({
        windowMs, limit: max, // (v6+ uses `limit`, not `max`)
        standardHeaders: true, legacyHeaders: false, ...options,
    });
};

// Custom limiter
export const limit = (max, windowMs, options = {}) => {
    return rateLimit({
        windowMs,
        limit: max,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: options.keyGenerator || ipKeyGenerator, ...options,
    });
};

// specific limiters
export const authLimiter = createLimiter(RATE_LIMITS.AUTHENTICATION);

export const unAuthorizedApiLimiter = createLimiter(RATE_LIMITS.UNAUTHORIZED);

export const authorizedApiLimiter = createLimiter(RATE_LIMITS.AUTHORIZED, {
    keyGenerator: (req) => req.user?.id || ipKeyGenerator(req), // smarter for logged-in users
});

