const API_DOMAIN = "http://localhost:8080/";

export const requestFile = async (path, method = "POST", formData, token = null) => {
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(API_DOMAIN + path, {
    method,
    headers,
    body: formData,
  });

  return response.json();
};