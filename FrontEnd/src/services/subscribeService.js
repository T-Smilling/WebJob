import { post } from "../utils/request"

export const subscribeToJob = async (id, options) => {
    return await post(`subscriber/${id}`,options,null)
}

export const sendEmailToSubscribers = async (id, token) =>{
    return await post(`subscriber/send-mail/${id}`,null,token)
}