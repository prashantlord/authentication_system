import express from "express";

import {validate} from "../middleware/validate.js";
import {authenticatedUser} from "../middleware/auth.middleware.js";

import loginSchema from "../schema/login.schema.js";
import registerSchema from "../schema/register.schema.js";

import {getUser, loginUser, registerUser} from "../controllers/user.controller.js";
import {emailVerification, promptEmailVerification} from "../controllers/email-verification.controller.js";
import {promptResetPassword, resetPassword} from "../controllers/reset-password.controller.js";
import {resetPasswordSchema} from "../schema/reset-password.schema.js";
import {forgotPasswordSchema, promptForgotPasswordSchema} from "../schema/forgot-password.schema.js";
import {forgotPassword, promptForgotPassword} from "../controllers/forgot-password.controller.js";
import {authLimiter, authorizedApiLimiter, unAuthorizedApiLimiter} from "../middleware/rateLimiter.js";

const router = express.Router();

// ===== PUBLIC =====
router.post('/login', authLimiter, validate(loginSchema), loginUser);
router.post('/register', authLimiter, validate(registerSchema), registerUser);

// ===== PASSWORD RESET (public but rate-limited) =====
router.use(unAuthorizedApiLimiter);
router.post("/forgot-password", validate(promptForgotPasswordSchema), promptForgotPassword);
router.patch("/forgot-password/:userId/:token", validate(forgotPasswordSchema), forgotPassword);

// ===== AUTH REQUIRED =====
router.use(authenticatedUser, authorizedApiLimiter);

// ===== PRIVATE =====
router.get("/", getUser);

// email verification
router.post("/verify-email", promptEmailVerification);
router.get("/verify-email/:userId/:token", emailVerification);

// password reset (authenticated)
router.post("/reset-password", promptResetPassword);
router.patch("/reset-password/:userId/:token", validate(resetPasswordSchema), resetPassword);

export default router;