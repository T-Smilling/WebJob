import { get, post, put } from "../utils/request"

export const applyJob = async(jobPostId,token) =>{
    return await post(`application/${jobPostId}`,null,token)
}
export const getApplicationsByJobPost = async (jobId, page, size,token) => {
    return await get(`application/${jobId}?page=${page}&size=${size}`,token)
}
export const updateApplicationStatus = async (jobPostId,applicationId,options,token) =>{
    return await put(`application/${jobPostId}/${applicationId}/status`,options,token)
}

export const getApplicationsByUser = async (page, size,token) => {
    return await get(`application/user?page=${page}&size=${size}`,token)
}