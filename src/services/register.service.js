import User from "../models/user.model.js";
import {throwError} from "../utils/response-helper.js";
import {generateJwtToken} from "../utils/token.js";

export default async function registerService(username, email, password) {
    try {
        const user = await User.create({
            username, email, password
        });

        const token = generateJwtToken({id: user._id, username, email});

        return {user, token};
    } catch (err) {
        if (err.code === 11000) {
            throwError(409, "User already exists");
        }
        throw err;
    }
}
