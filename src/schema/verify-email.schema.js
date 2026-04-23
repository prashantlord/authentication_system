import {z} from "zod";

export const promptVerifyEmailSchema = z.object({
    email: z.string().email().max(255).lowercase().trim()
});