import { del, get, post, put } from "../utils/request"

export const checkEmployee = async (companyId, token) => {
    return await post(`employee/company/${companyId}`,null,token)
}

export const getCompanyByEmployee = async (token) =>{
    return await get("employee/company",token)
}

export const addEmployee = async (companyId, options,token) => {
    return await post(`employee/${companyId}`,options,token)
}

export const getEmployerInCompany = async (companyId,page,size,token) =>{
    return await get(`employee/${companyId}?page=${page}&size=${size}`,token)
}

export const deleteEmployee = async (companyId,employeeId,token) =>{
    return await del(`employee/${companyId}/${employeeId}`,token)
}

export const updateEmployee = async (companyId, employeeId, options, token) =>{
    return await put(`employee/${companyId}/${employeeId}`,options,token)
}