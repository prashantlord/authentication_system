import express from "express";
import authRoutes from "./auth.routes.js";

const router = express.Router();

router.use('/users', authRoutes);

export default router;