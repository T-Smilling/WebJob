import { post } from "../utils/request.js";

export const validateToken = async (token) => {
    return await post("auth/validate-token", null,token);
}
