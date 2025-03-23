import { del, get } from "../utils/request"
import { requestFile } from "../utils/requestFile"

export const getAllCompany = async (page,size) =>{
  return await get(`company?page=${page}&size=${size}`)
}

export const getCompanyById = async (id, page, size) =>{
    return await get(`company/${id}?page=${page}&size=${size}`)
}

export const createCompany = async (formData,token) =>{
  return await requestFile("company","POST",formData,token)
}

export const updateCompany = async (id,formData, token) =>{
  return await requestFile(`company/${id}`,"PUT",formData,token)
}

export const deleteCompany = async (id,token) =>{
  return await del(`company/${id}`,token)
}