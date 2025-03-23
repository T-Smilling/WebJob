import { post,get, del } from "../utils/request.js";
import { requestFile } from "../utils/requestFile.js";

export const register = async (user) => {
    return await post("users/register", user);
}

export const login = async (user) => {
    return await post("auth/login", user);
}

export const logoutUser = async (token) => {
    return await post("auth/logout", null, token);
}

export const getInfoUser = async (token) => {
    return await get("users/my-info",token)
}

export const forgotPassword = async (options) => {
    return await post("users/forgot-password",options)
}

export const changePassword = async (code,options) => {
    return await post(`users/change-password/${code}`,options)
}

export const confirmAccount = async (code) => {
    return await get(`users/confirm-account/${code}`)
}

export const updateUser = async (id, formData,token) =>{
    return await requestFile(`users/${id}`,'PUT',formData,token)
}

export const getAllUser = async (page,size,token) =>{
    return await get(`users?page=${page}&size=${size}`,token)
}

export const deleteUser = async (id, token) =>{
    return await del(`users/${id}`,token)
}