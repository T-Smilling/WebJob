import { del, get } from "../utils/request.js";
import { requestFile } from "../utils/requestFile.js";

export const uploadResume = async (formData, token) => {
  return await requestFile("resume", "POST", formData, token);
};

export const getLastCv = async (token) =>{
  return await get("resume/last-resume",token)
}

export const deleteResume = async (resumeId,token) =>{
  return await del(`resume/${resumeId}`,token)
}

export const getAllCVByUser = async (token,page,size) =>{
  return await get(`resume?page=${page}&size=${size}`,token)
}