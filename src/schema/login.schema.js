import {z} from "zod";

export default z.object({
    email: z.string().email().max(255).lowercase().trim(),
    password: z.string().min(8, "Password much be of min 8 letters.").max(255),
});