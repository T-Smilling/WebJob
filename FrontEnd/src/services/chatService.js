import { get, post, del } from '../utils/request';

export const chatService = {
    sendMessage: async (message, token = null) => {
        return await post('chat/send', { message }, token);
    },

    getChatHistory: async (token = null) => {
        return await get('chat/history', token);
    },

    clearChatHistory: async (token = null) => {
        return await del('chat/clear', token);
    }
}; 