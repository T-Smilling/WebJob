import { post } from "../utils/request"

export const upRole = async (options, token) => {
    return await post("roles/update", options,token)
}