import loginService from "../services/login.service.js";
import registerService from "../services/register.service.js";
import {successResponse, throwError} from "../utils/response-helper.js";

export function getUser(req, res) {
    const user = req.user;

    if (!user) {
        throwError(404, "User not found");
    }

    const data = successResponse(200, "User Fetched Successfully", user);

    return res.status(data.statusCode).json(data);
}

export async function loginUser(req, res) {
    const {email, password} = req.body;

    const {user, token} = await loginService(email, password);

    const data = successResponse(200, "Login successful", {user, token});

    return res.status(data.statusCode).json(data);
}

export async function registerUser(req, res) {
    const {username, email, password} = req.body;

    const {user, token} = await registerService(username, email, password);

    const data = successResponse(201, "Registration successful", {user, token});

    return res.status(data.statusCode).json(data);
}
