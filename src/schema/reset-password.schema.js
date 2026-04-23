import {z} from "zod";

export const resetPasswordSchema = z.object({
    oldPassword: z.string().min(8, "Password must be at least 8 characters.").max(255),
    newPassword: z.string().min(8, "Password must be at least 8 characters.").max(255),
    newPasswordConfirmation: z
        .string()
        .min(8, "Password confirmation must be at least 8 characters.").max(255),
})
    .refine((data) => data.newPassword === data.newPasswordConfirmation, {
        message: "Passwords do not match.", path: ["newPasswordConfirmation"],
    })
    .transform(({newPasswordConfirmation, ...rest}) => rest);