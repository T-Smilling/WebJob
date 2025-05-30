const API_DOMAIN = "http://localhost:8080/"

const request = async (path, method = "GET", options = null, token = null) => {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const fetchOptions = {
        method,
        headers,
        body: options ? JSON.stringify(options) : null,
    };
    // Chỉ thêm credentials cho API chat
    if (path.startsWith('chat/')) {
        fetchOptions.credentials = 'include';
    }

    const response = await fetch(API_DOMAIN + path, fetchOptions);
    return response.json();
};

export const get = (path, token = null) => request(path, "GET", null, token);
export const post = (path, options, token = null) => request(path, "POST", options, token);
export const put = (path, options, token = null) => request(path, "PUT", options, token);
export const del = (path, token = null) => request(path, "DELETE", null, token);
