import Cookies from "js-cookie";

export const getUserScopes = () => {
  const token = Cookies.get("token");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.scope ? payload.scope.split(" ") : [];
    } catch (error) {
      console.error("Error decoding token:", error);
      return [];
    }
  }
  return [];
};

// Kiểm tra ít nhất một scope trong danh sách requiredScopes
export const hasScope = (scopes, ...requiredScopes) => {
  return requiredScopes.some((scope) => scopes.includes(scope));
};

// Kiểm tra tất cả scope (giữ nguyên nếu cần dùng sau này)
export const hasAllScopes = (scopes, requiredScopes) => {
  return requiredScopes.every((scope) => scopes.includes(scope));
};