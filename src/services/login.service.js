import User from "../models/user.model.js";
import {throwError} from "../utils/response-helper.js";
import {generateJwtToken} from "../utils/token.js";

export default async function loginService(email, password) {
    const user = await User.findOne({
        email
    }).select("+password");

    if (!user) throwError(404, "User not found");

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throwError(401, "Invalid password");
    }

    const token = generateJwtToken({id: user._id, username: user.username, email: user.email});

    return {user, token};
}