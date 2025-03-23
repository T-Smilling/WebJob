import { del, get, post, put } from "../utils/request";

export const getListCity = async () => {
    return await get("jobs/city");
}

export const searchJob = async (location,title,page,size,jobType,jobLevel,minSalary,maxSalary,skill) => {
    let url = `jobs/search?location=${location}&title=${title}&page=${page}&size=${size}`;

  if (jobType) {
    url += `&jobType=${jobType}`;
  }

  if (jobLevel) {
    url += `&jobLevel=${jobLevel}`;
  }

  if (minSalary) {
    url += `&minSalary=${minSalary}`;
  }

  if (maxSalary) {
    url += `&maxSalary=${maxSalary}`;
  }

  if (skill) {
    url += `&skill=${skill}`;
  }

  return await get(url);
}

export const createJob = async (companyId,options, token) => {
  return await post(`jobs/${companyId}`,options,token)
}

export const getJobDetail = async (id) => {
    return await get(`jobs/${id}`);
}

export const getHomeJob = async () => {
    return await get("jobs");
}

export const getAllJob = async (page,size) => {
    return await get(`jobs/all-jobs?page=${page}&size=${size}`);
}

export const getAllSkill = async() =>{
    return await get("jobs/skill")
}

export const checkCreateBy = async(id,token) =>{
  return await post(`jobs/employee/${id}`,null,token)
}

export const updateJob = async(id,options,token) =>{
  return await put(`jobs/${id}`,options,token)
}

export const deleteJob = async (id,token) =>{
  return await del(`jobs/${id}`,token)
}