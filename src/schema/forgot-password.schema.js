import {z} from "zod";

export const promptForgotPasswordSchema = z.object({
    email: z.string().email().max(255).lowercase().trim()
});

export const forgotPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters.").max(255),
    newPasswordConfirmation: z
        .string()
        .min(8, "Password confirmation must be at least 8 characters.").max(255),
})
    .refine((data) => data.newPassword === data.newPasswordConfirmation, {
        message: "Passwords do not match.", path: ["newPasswordConfirmation"],
    })
    .transform(({newPasswordConfirmation, ...rest}) => rest);