export const RATE_LIMITS = {
    AUTHENTICATION: {windowMs: 60 * 1000, max: 5},
    UNAUTHORIZED: {windowMs: 5 * 60 * 1000, max: 5},
    AUTHORIZED: {windowMs: 5 * 60 * 1000, max: 10},
};