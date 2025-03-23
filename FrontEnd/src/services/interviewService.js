import { del, post, put } from "../utils/request"

export const createInterview = async (applicationId,options, token) =>{
    return await post( `interview/${applicationId}`,options,token)
}

export const updateInterview = async (applicationId,interviewId,options, token) =>{
    return await put( `interview/${applicationId}/${interviewId}`,options,token)
}

export const deleteInterview = async (applicationId,interviewId, token) =>{
    return await del( `interview/${applicationId}/${interviewId}`,token)
}