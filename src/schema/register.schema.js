import {z} from "zod";

export default z.object({
    username: z.string().max(255).lowercase().trim(),
    email: z.string().email().max(255).lowercase().trim(),
    password: z.string().min(8, "Password much be of min 8 letters.").max(255),
    passwordConfirmation: z
        .string()
        .min(8, "Password confirmation must be at least 8 characters.").max(255),
})
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords do not match.", path: ["passwordConfirmation"],
    })
    .transform(({passwordConfirmation, ...rest}) => rest);